import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { CacheService } from '../services/cache.service';

// Define a quick inline Mongoose model schema for Tenant lookup to decouple from Prisma
const TenantSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const TenantModel = mongoose.models.Tenant || mongoose.model('Tenant', TenantSchema);
const cache = new CacheService();

export async function tenantInterceptor(req: Request, res: Response, next: NextFunction): Promise<void> {
  const targetTenant = req.headers['x-tenant-id'] as string || req.headers['x-tenant-slug'] as string;

  if (!targetTenant) {
    res.status(400).json({ error: 'Tenant execution context identifier missing from request headers.' });
    return;
  }

  const cacheKey = `tenant:meta:${targetTenant}`;
  try {
    let tenantMeta = await cache.get<{ id: string; isActive: boolean }>(cacheKey);

    if (!tenantMeta) {
      // Handle lookups gracefully whether the header is a MongoDB ObjectId or a text slug
      const isObjectId = mongoose.Types.ObjectId.isValid(targetTenant);
      const query = isObjectId ? { _id: targetTenant } : { slug: targetTenant };
      
      const tenant = await TenantModel.findOne(query).select('_id isActive').lean();

      if (!tenant) {
        res.status(404).json({ error: 'Target tenant metadata context matching context could not be resolved.' });
        return;
      }

      tenantMeta = { id: (tenant._id as any).toString(), isActive: tenant.isActive };
      await cache.set(cacheKey, tenantMeta, 1800);
    }

    if (!tenantMeta.isActive) {
      res.status(403).json({ error: 'Target commercial tenant space has been administratively suspended.' });
      return;
    }

    (req as any).tenantId = tenantMeta.id;
    next();
  } catch (err) {
    console.error('Tenant Resolution Engine Malfunction:', err);
    res.status(500).json({ error: 'Internal context structural resolution errors encountered.' });
  }
}