import { inject, injectable } from "inversify";
import { IAdminController } from "../interfaces/IAdminController";
import { NextFunction, Response } from "express";
import { CustomRequest } from "../../utils/CustomRequest";
import { Roles } from "../../constants/Roles";
import { AppError } from "../../utils/AppError";
import { HttpStatusCode } from "../../constants/HttpStatusCodes";
import { Tokens } from "../../constants/Tokens";
import { IChangeUserStatusUseCase, IGetAllUserDataUseCase } from "../../Applications/interfaces/admin.interface";
import { TPagination } from "../../shared/types/CommonTypes";
import { ResponseHandler } from "../../middlewares/ResponseHandle";

@injectable()
export class AdminController implements IAdminController {
    constructor(
        @inject(Tokens.getAllUsersUseCase) private _getallUsersUsecase: IGetAllUserDataUseCase,
        @inject(Tokens.changeUserStatusUseCase) private _changeUserStatusUseCase: IChangeUserStatusUseCase
    ) { }
    async getAllUserDetails(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const role = req.role
            console.log(role)
            if (role !== Roles.admin_role) {
                throw new AppError("only admin role can access", HttpStatusCode.FORBIDDEN)
            }
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search as string
            const sortField = req.query.sortField as string;
            const sortOrder = req.query.sortOrder as string;
            console.log(page, limit, search, sortField, sortOrder)
            const allowedSortFields = ["firstname", "updatedAt"];

            if (!allowedSortFields.includes(sortField)) {
                throw new AppError("SortField Not Found or Not Accessible",HttpStatusCode.BAD_REQUEST)
            }

            const { users, TotalData } = await this._getallUsersUsecase.GetAllUseDetails(page, limit, role, search, sortField, sortOrder)

            const pagination: TPagination = { page: page, limit: limit, totalData: TotalData, totalPages: Math.ceil(TotalData / limit) }
            const result = {
                users,
                pagination
            }
            ResponseHandler.success(res, "ALL Users Data fetched", result, HttpStatusCode.OK)
        } catch (error) {
            next(error)
        }
    }
    async ChangerUserStatus(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.body
            const role = req.role
            if (role !== Roles.admin_role) {
                throw new AppError("only admin can access", HttpStatusCode.BAD_REQUEST)
            }

            const { user, message } = await this._changeUserStatusUseCase.changeUserStatus(userId)

            ResponseHandler.success(res, message, user, HttpStatusCode.OK)
        } catch (error) {
            next(error)
        }
    }
}