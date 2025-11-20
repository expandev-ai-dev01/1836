import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import {
  purchaseCreate,
  purchaseDelete,
  purchaseGet,
  purchaseList,
  purchaseUpdate,
} from '@/services/purchase/purchaseRules';

const securable = 'PURCHASE';

// Zod Schemas
const purchaseSchema = z.object({
  productName: z.string().min(2).max(100),
  quantity: z.coerce.number().positive(),
  unitMeasure: z.enum(['un', 'kg', 'g', 'L', 'mL']),
  unitPrice: z.coerce.number().positive(),
  purchaseDate: z
    .string()
    .refine((date) => new Date(date) <= new Date(), { message: 'Date cannot be in the future' }),
});

const idSchema = z.object({
  id: z.string().uuid(),
});

export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);
  const [validated, error] = await operation.list(req);

  if (!validated) return next(error);

  try {
    const data = await purchaseList({ idAccount: validated.credential.idAccount });
    res.json(successResponse(data));
  } catch (error: any) {
    res.status(StatusGeneralError).json(errorResponse('Internal server error'));
  }
}

export async function createHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'CREATE' }]);
  const [validated, error] = await operation.create(req, purchaseSchema);

  if (!validated) return next(error);

  try {
    const data = await purchaseCreate({
      ...validated.credential,
      ...validated.params,
    });
    res.json(successResponse(data));
  } catch (error: any) {
    res.status(StatusGeneralError).json(errorResponse('Internal server error'));
  }
}

export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);
  const [validated, error] = await operation.read(req, idSchema);

  if (!validated) return next(error);

  try {
    const data = await purchaseGet({
      idAccount: validated.credential.idAccount,
      id: validated.params.id,
    });

    if (!data) {
      res.status(404).json(errorResponse('Purchase not found', 'NOT_FOUND'));
      return;
    }

    res.json(successResponse(data));
  } catch (error: any) {
    res.status(StatusGeneralError).json(errorResponse('Internal server error'));
  }
}

export async function updateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'UPDATE' }]);
  const [validated, error] = await operation.update(req, idSchema, purchaseSchema);

  if (!validated) return next(error);

  try {
    await purchaseUpdate({
      idAccount: validated.credential.idAccount,
      id: validated.params.id,
      ...validated.params,
    });
    res.json(successResponse({ success: true }));
  } catch (error: any) {
    if (error.message === 'purchaseNotFound') {
      res.status(404).json(errorResponse('Purchase not found', 'NOT_FOUND'));
    } else {
      res.status(StatusGeneralError).json(errorResponse('Internal server error'));
    }
  }
}

export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'DELETE' }]);
  const [validated, error] = await operation.delete(req, idSchema);

  if (!validated) return next(error);

  try {
    await purchaseDelete({
      idAccount: validated.credential.idAccount,
      id: validated.params.id,
    });
    res.json(successResponse({ success: true }));
  } catch (error: any) {
    if (error.message === 'purchaseNotFound') {
      res.status(404).json(errorResponse('Purchase not found', 'NOT_FOUND'));
    } else {
      res.status(StatusGeneralError).json(errorResponse('Internal server error'));
    }
  }
}
