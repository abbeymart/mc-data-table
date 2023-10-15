/**
 * @Author: abbeymart | Abi Akindele | @Created: 2020-06-29 | @Updated: 2020-07-01, 2021-08-01
 * @Company: mConnect.biz | @License: MIT
 * @Description: datatable types
 */
import type { CrudParamsType } from "./supportTypes";

/**
 * @typedef
 * @param {string} key
 * @param {any} value
 */
export interface ObjectType {
    [key: string]: any;
}

// export type ObjectType = ObjectRefType | object;

export type Task = (item?: ObjectType | any) => any;
export type TransformTask = ((item?: any) => any) | null;
export type TaskUpdate = (item?: ObjectType) => any;
export type TaskDelete = (itemId?: string) => any;
export type Value = string | ObjectType | TaskUpdate | TaskDelete | object;
export type ItemTaskType = Task | TaskUpdate | TaskDelete;

/**
 * @typedef
 */
export type DataSourceTypes = "provider" | "taskLink" | "checkbox" | "custom" | "customInfo" | "customUpdate" | "customDelete";

/**
 * @interface
 * @param {DataSourceTypes} type        // field-value source (e.g. provider => DB, taskLink => task-action etc.)
 * @param {Task} [task]                 // task function to be performed for task (e.g. click/update/delete)
 * @param {Array<string>} [params]      // task function optional parameters - could be item(complete-record) or field-names (e.g. 'id')
 * @param {Array<ObjectType>} [data]    // record from dataItems/records
 * @param {Array<string>} [bind]        // capture arrays of records' ids for CRUD operations
 * @param {boolean} [domComp]           // indicate if the value of the field/column is a DOM Component that may be used as HTML (e.g. v-html)
 * @param {TransformTask} [trasform]    // transform function to transform field/column value prior-to and for table view/display
 */
export interface DataSource {
    type: DataSourceTypes;
    task?: Task;    // e.g addItemId
    params?: Array<string>; // reserved keywords: "item" & "record" for item-record param-value only
    data?: Array<ObjectType>,
    bind?: Array<string>;   // itemsIds
    domComp?: boolean,
    transform?: TransformTask;   // shortDesc
}

export type PermittedEvents = "click" | "mouseover" | "mouseleave" | "mouseenter" | "change";

export interface EventType {
    type: PermittedEvents;
    task?: Task;
    action?: Task;
    params?: ObjectType;
}

export type FieldTypes = "boolean" | "string" | "number" | ObjectType | "object" | "custom";

/**
 * @typedef
 * @param {string} name field-name from the dataItems record, must match the field-name of the dataItem Type
 * @param {string} label label-name for the field column
 * @param {FieldTypes} type field/column value type - "boolean" | "string" | "number" | ObjectType | "object" | "custom"
 * @param {boolean | string | number | ObjectType | object} [default] optional default field value
 * @param {number} order order number for the table columns
 * @param {boolean} sort indicate if the column is sortable (ascending or descending)
 * @param {DataSource} source the field/column value source, including optional task(action-function)
 * @param {Array<EventType>} events events specification for the data field
 *
 */
export interface DataField {
    name: string;
    label: string;
    type: FieldTypes;
    default?: boolean | string | number | ObjectType | object;
    order?: number;
    sort?: boolean;
    source: DataSource;
    events?: Array<EventType>;
}

export interface TableStyle {
    table: string;
    tableHeader: string;
    tableBody: string;
}

export interface SortStyle {
    asc: string;
    desc: string;
}

export type PagePosition = "" | "first-page" | "next-page" | "previous-page" | "last-page" | "page-number";

export interface DataStats {
    skip?: number;
    limit?: number;
    recordsTotal?: number;
    totalRecordsCount?: number;      // set to initialRecordTotal
    pages?: {
        start: number;      // calculate from skip/limit/totalRecordsCount
        end: number;        // calculate from skip/limit/totalRecordsCount
    };
    currentPages?: {        // calculate from pageLimit, skip, limit, recordsTotal/totalRecordsCount & pages
        start: number;
        end: number;
    };
    previousPages?: {
        start: number;
        end: number;
    };
    nextPages?: {
        start: number;
        end: number;
    };
}

export interface DataFetchAlertResult {
    skip: number;
    limit?: number;
    fetchAlert?: boolean;
    currentStats?: {        // calculate from pageLimit, skip, limit, recordsTotal/totalRecordsCount & pages
        startPage: number;
        endPage: number;
        currentPage: number;
        dataItemsTotal: number;
    };
}

export type GetRequestType = (crudParams: CrudParamsType) => any

export type DataFetchAlert = (val: DataFetchAlertResult, getRequest?: GetRequestType) => void

export type PermitSaveDelete = (itemId: string) => boolean

export interface DataTableProps {
    dataFields: Array<DataField>
    dataItems: Array<ObjectType>
    dataStats?: DataStats;
    totalRecordsCount?: number;
    dataFetchAlert?: DataFetchAlert;
    permitSaveDelete?: PermitSaveDelete;
    permitSaveDeleteMessage?: string;
    dataTotal?: number;
    paging?: boolean;
    pageStart?: number;
    pageLimit?: number;
    pageLimits?: Array<number>;
    tableStyle?: TableStyle;
    sortStyle?: SortStyle;
    permittedEvents?: Array<PermittedEvents>;
}

export interface DataTableState {
    dataFields: Array<DataField>;
    dataItems: Array<ObjectType>;
    dataStats: DataStats;
    totalRecordsCount: number;
    dataFetchAlert?: DataFetchAlert;
    dataTotal: number;
    paging: boolean;
    pageStart: number;
    pageLimits: Array<number>;
    tableStyle: TableStyle;
    sortStyle: SortStyle;
    permittedEvents: Array<PermittedEvents>;
    dataCount: number;
    pageLimit: number;
    currentPage: number;
    searchKey: string;
    dataItemsCount: number;
    recordTotal: number;
    dataFieldsCount: number;
}

export type SetPageLimit = (val: number) => void;

export interface PageLimitProps {
    pageLimit?: number;
    pageLimits?: Array<number>;
    setPageLimit: SetPageLimit;
}

export interface PageLimitState {
    pageLimit: number;
    pageLimits: Array<number>;
    setPageLimit: SetPageLimit;
    labelOn: boolean
}

export type SetCurrentPage = (val: number) => void;

export interface PageNavProps {
    pagePosition?: PagePosition;
    dataTotal?: number;
    pageLimit?: number;
    currentPage?: number;
    dataStats?: DataStats;
    setCurrentPage: SetCurrentPage;
    totalRecordsCount?: number;
    dataFetchAlert?: DataFetchAlert;
}

export interface PageNavState {
    pagePosition: PagePosition;
    dataTotal: number;
    pageLimit: number;
    currentPage: number;
    dataStats: DataStats;
    setCurrentPage: SetCurrentPage;
    totalRecordsCount: number;
    dataFetchAlert?: DataFetchAlert;
    lastPage: number;
    pageList: Array<string>;
}

export interface TableMessageProps {
    totalRecordsCount?: number;
    dataTotal?: number;
    pageLimit?: number;
    currentPage?: number;
}

export interface TableMessageState {
    totalRecordsCount: number;
    dataTotal: number;
    pageLimit: number;
    currentPage: number;
    itemFrom: number;
    itemTo: number;
}

export interface TableNoDataProps {
    dataItemsCount?: number;
}

export interface TableNoDataState {
    dataItemsCount: number;
}

export type SetSearchKey = (val: string) => void;

export type SetNumber = (val: number) => void;
export type SetString = (val: string) => void;
export type SetBool = (val: boolean) => void;
export type SetObject = (val: ObjectType) => void;

export interface TableSearchProps {
    searchKey?: string;
    setSearchKey: SetSearchKey;
}

export interface TableSearchState {
    searchKey: string;
    setSearchKey: SetSearchKey;
}


export type SetDataItems = (val: Array<ObjectType>) => void;

export type SetDataItemsTotal = (val: number) => void;

export interface TableProps {
    itemsIds?: Array<string>;
    sortAsc?: boolean;
    sortDesc?: boolean;
    dataFields: Array<DataField>
    dataItems: Array<ObjectType>
    pageLimit?: number;
    currentPage?: number;
    tableStyle: TableStyle;
    sortStyle: SortStyle;
    searchKey?: string;
    setDataItems: SetDataItems;
    setDataTotal: SetDataItemsTotal;
    permittedEvents: Array<string>;

}

export interface TableState {
    itemsIds: Array<string>;
    sortAsc: boolean;
    sortDesc: boolean;
    dataFields: Array<DataField>;
    dataItems: Array<ObjectType>;
    pageLimit: number;
    currentPage: number;
    tableStyle: TableStyle;
    sortStyle: SortStyle;
    searchKey: string;
    setDataItems: SetDataItems;
    setDataTotal: SetDataItemsTotal;
    permittedEvents: Array<string>;
    // computed fields
    tableFields: Array<DataField>;
    computedDataItems: Array<ObjectType>;
    itemsTotal: number;
    sortStyleCopy: SortStyle;
    sortStyleAsc: string;
    sortStyleDesc: string;
    dataItemsSearch: Array<ObjectType>;
    tableItems: Array<ObjectType>;
    tableRecords: Array<ItemData>;
}

export interface FieldItemInfo {
    fieldValue: any;
    fieldSource: DataSource;
    fieldType: FieldTypes; // Deprecated: "provider" | "taskLink" | "checkbox" | "custom"
    fieldSourceType: DataSourceTypes;
    fieldName: string;
    fieldTask: Task | TaskUpdate | TaskDelete;
    fieldParams: ObjectType;
    fieldLabel: string;
    fieldEvents: Array<EventType>;
}

export interface ItemData extends ObjectType {
    fieldsInfo: Array<FieldItemInfo>;
    itemRecord: ObjectType;
}

export interface ActiveProps {
    isActive?: boolean;
    activeLabel?: string;
    inActiveLabel?: string;
}

export interface DeleteProps {
    itemTask: TaskDelete;
    itemId: string;
    itemLabel?: string;
}

export interface UpdateProps {
    itemTask: TaskUpdate;
    itemData: ObjectType;
    itemLabel?: string;
}

export interface ActiveProps {
    isActive?: boolean;
    activeLabel?: string;
    inActiveLabel?: string;
}

export interface DeleteProps {
    itemTask: TaskDelete;
    itemId: string;
    itemLabel?: string;
}

export interface UpdateProps {
    itemTask: TaskUpdate;
    itemData: ObjectType;
    itemLabel?: string;
}
