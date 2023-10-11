
export interface ObjectRefType {
    [key: string]: any;
}

export type ObjectType = ObjectRefType | object;

export interface ActionParamType {
    [key: string]: any;         // fieldName: fieldValue, must match fieldType (re: validate) in model definition
}

// @ts-ignore
export type ActionParamsType = Array<ActionParamType>;  // documents for create or update task/operation

export interface QueryParamsType {
    [key: string]: any;
}

export interface ProjectParamsType {
    [key: string]: number; // 1 for inclusion and 0 for exclusion
}

export interface SortParamsType {
    [key: string]: number;          // 1 for "asc", -1 for "desc"
}

// UserInfo type: required for access management
export interface UserInfoType {
    userId?: string;
    firstname?: string;
    lastname?: string;
    language?: string;
    loginName?: string;
    token?: string;
    expire?: number;
    email?: string;
}

export interface CrudParamsType {
    token?: string;
    userInfo?: UserInfoType;
    recordIds?: Array<any>;
    actionParams?: ActionParamsType;
    queryParams?: QueryParamsType;
    projectParams?: ProjectParamsType;
    sortParams?: SortParamsType;
    skip?: number;
    limit?: number;
}