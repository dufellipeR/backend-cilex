import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateEntityService from '@modules/product/services/CreateEntityService';
import ListEntityService from '@modules/product/services/ListEntityService';
import ShowEntityService from '@modules/product/services/ShowEntityService';
import UpdateEntityService from '@modules/product/services/UpdateEntityService';
import DeleteEntityService from '@modules/product/services/DeleteEntityService';
import CalculateInventoryService from '@modules/product/services/CalculateInventoryService';

export default class EntityController {
  public async calculateInventory(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const { storage_id, startDate, endDate } = req.body;

    const calculateInventory = container.resolve(CalculateInventoryService);

    const resume = await calculateInventory.execute(
      storage_id,
      startDate,
      endDate,
    );

    return res.json(classToClass(resume));
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const {
      code,
      description,
      application_id,
      dimensions_id,
      family_id,
      group_id,
      subfamily_id,
      subgroup_id,
      technical_description,
      type_id,
      umc_id,
      umu_id,
      standard_storage,
    } = req.body;

    try {
      const picture = req.files.picture[0].filename;
    } catch (e) {}

    try {
      const technical_picture = req.files.technical_picture[0].filename;
    } catch (e) {}

    const createEntity = container.resolve(CreateEntityService);

    const entity = await createEntity.execute({
      code,
      description,
      application_id,
      dimensions_id,
      family_id,
      group_id,
      subfamily_id,
      subgroup_id,
      picture,
      technical_picture,
      technical_description,
      type_id,
      umc_id,
      umu_id,
      standard_storage,
    });

    return res.json(entity);
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const listEntity = container.resolve(ListEntityService);

    const list = await listEntity.execute();

    return res.json(classToClass(list));
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const showService = container.resolve(ShowEntityService);

    const result = await showService.execute(id);

    return res.json(classToClass(result));
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const {
      code,
      description,
      application_id,
      dimensions_id,
      family_id,
      group_id,
      subfamily_id,
      subgroup_id,
      technical_description,
      type_id,
      umc_id,
      umu_id,
      standard_storage,
    } = req.body;

    const { id } = req.params;

    const update = container.resolve(UpdateEntityService);
    try {
      const picture = req.files.picture[0].filename;
    } catch (e) {}

    try {
      const technical_picture = req.files.technical_picture[0].filename;
    } catch (e) {}

    const entity = await update.execute({
      id: id as string,
      code,
      description,
      application_id,
      dimensions_id,
      family_id,
      group_id,
      subfamily_id,
      subgroup_id,
      picture,
      technical_picture,
      technical_description,
      type_id,
      umc_id,
      umu_id,
      standard_storage,
    });

    return res.json(entity);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const deleteService = container.resolve(DeleteEntityService);

    const result = await deleteService.execute(id as string);

    return res.json(classToClass(result));
  }
}
