import { ref } from "vue";
import type {
    DataFetchAlert, DataFetchAlertResult, DataField, DataStats, DataTableProps, GetRequestType, ObjectType,
    PermitSaveDelete,
    PermittedEvents, SortStyle, TableStyle,
} from "./types";

const defaultTableStyle: TableStyle = {
    table      : "w3-table w3-striped w3-border w3-bordered w3-hoverable",
    tableHeader: "w3-red",
    tableBody  : "w3-hover",
}
// change to material icons, Oct-19-2023
// asc : "fa fa-caret-up",  | expand_less/keyboard_arrow_up (name), material-icons (style)
// desc: "fa fa-caret-down", | expand_more/keyboard_arrow_down (name), material-icons (style)
const defaultSortStyle: SortStyle = {
    asc : "keyboard_arrow_up",
    desc: "keyboard_arrow_down",
}
const defaultPageLimits: Array<number> = [10, 20, 30, 50, 100, 200]
const defaultPermittedEvents: Array<PermittedEvents> = ["click", "mouseover", "mouseleave", "mouseenter"]

const setLocalStorage = (storeId: string, storeValue: any) => {
    localStorage.setItem(storeId, JSON.stringify(storeValue))
}

const getLocalStorage = (storeId: string): any => {
    return localStorage.getItem(storeId)
}

export function useDatatable(props?: DataTableProps) {
    const tableStyle = ref<TableStyle>(defaultTableStyle)
    const sortStyle = ref<SortStyle>(defaultSortStyle)
    const dataFields = ref<Array<DataField>>([])    // data-fields for composing the data columns
    const dataItems = ref<Array<ObjectType>>([])    // compute data-items for the currentPage
    const dataStats = ref<DataStats>({})
    const dataFetchAlert = ref<DataFetchAlert>()
    const permitSaveDelete = ref<PermitSaveDelete>()
    const permitSaveDeleteMessage = ref<string>("Update and Delete tasks are not permitted")
    const paging = ref<boolean>(true)
    const pageStart = ref<number>(1)
    const pageLimit = ref(10)
    const currentPage = ref(1)
    const searchKey = ref("")
    const dataItemsCount = ref(0)       // dataItemsCount
    const searchItemsCount = ref(0)     // data-items-count for the current-search result
    const dataCount = ref(0)            // dataCount is the count for the current data-record?
    const dataTotal = ref<number>(0)    // dataTotal for the current data-batch (paging)
    const totalRecordsCount = ref(0)    // recordsCount for all available data-records
    const pageLimits = ref<Array<number>>(defaultPageLimits)
    const permittedEvents = ref<Array<PermittedEvents>>(defaultPermittedEvents)
    const fetchAlertResult = ref<DataFetchAlertResult>({skip: 0,})  // fetchAlert function/parameters to fetch/page data
    const startPage = ref(1)    // startPage of the dataTotal for the current data-batch (paging)
    const endPage = ref(1)      // endPage of the dataTotal for the current data-batch (paging)
    const lastPage = ref(1)     // lastPage of the totalRecordsCount
    const savedCurrentPage = ref(1) // the stored/persisted-value of the currentPage

    const setStartPage = (val: number) => {
        startPage.value = val
    }

    const setEndPage = (val: number) => {
        endPage.value = val
    }

    const setLastPage = (val: number) => {
        lastPage.value = val
    }

    if (props && props.tableStyle) {
        tableStyle.value = props.tableStyle
    }
    if (props && props.sortStyle) {
        sortStyle.value = props.sortStyle
    }
    if (props && props.dataFields) {
        dataFields.value = props.dataFields
    }
    if (props && props.dataItems) {
        dataItems.value = props.dataItems
        dataTotal.value = props.dataStats?.recordsTotal || props.dataItems.length
    }
    if (props && props.dataStats) {
        dataStats.value = props.dataStats
        // dataTotal.value = props.dataStats.recordsTotal || props.dataItems.length
        const skip = props.dataStats.skip || 0
        const limit = props.dataStats.limit || 10000
        const totalRecsCount = props.dataStats.totalRecordsCount || totalRecordsCount.value || 0
        const dTotal = props.dataStats.recordsTotal || dataTotal.value || 0
        if (skip === 0 || skip <= pageLimit.value || skip < limit) {
            setStartPage(1);
        } else {
            setStartPage(Math.ceil((skip + 1) / pageLimit.value))
        }
        setEndPage(Math.ceil((skip + dTotal) / pageLimit.value))    // endPage for the current dataFetch (skip + dataTotal)
        setLastPage(Math.ceil(totalRecsCount / pageLimit.value))
        totalRecordsCount.value = totalRecsCount
    }
    if (props && props.dataFetchAlert) {
        dataFetchAlert.value = props.dataFetchAlert
    }
    if (props && props.permitSaveDelete) {
        permitSaveDelete.value = props.permitSaveDelete
    }
    if (props && props.permitSaveDeleteMessage) {
        permitSaveDeleteMessage.value = props.permitSaveDeleteMessage
    }
    if (props && props.paging) {
        paging.value = props.paging
    }
    if (props && props.pageStart) {
        pageStart.value = props.pageStart
    }
    if (props && props.pageLimits) {
        pageLimits.value = props.pageLimits
    }
    if (props && props.permittedEvents) {
        permittedEvents.value = props.permittedEvents
    }

    if (!dataFetchAlert.value) {
        dataFetchAlert.value = async (val: DataFetchAlertResult, getRequest?: GetRequestType) => {
            // store fetchAlertResult
            fetchAlertResult.value = val
            // perform the required crud-action/task
            if (val.fetchAlert && getRequest) {
                await getRequest({
                    skip : val.skip,
                    limit: val.limit,
                })
            }
        }
    }

    const sCPage = getLocalStorage("currentPage")
    if (sCPage && parseInt(sCPage)) {
        let sCPageVal = parseInt(sCPage)
        if (sCPageVal < startPage.value) {
            sCPageVal = startPage.value
        } else if (sCPageVal > endPage.value) {
            sCPageVal = endPage.value
        }
        savedCurrentPage.value = sCPageVal
        setLocalStorage("currentPage", sCPageVal)
    }

    const setPageLimit = (val: number) => {
        pageLimit.value = val
    }

    const setSearchKeyValue = (val: string) => {
        searchKey.value = val
    }

    const setCurrentPage = (val: number) => {
        currentPage.value = val
        setLocalStorage("currentPage", val)
    }

    const getCurrentPage = (): number => {
        return currentPage.value || parseInt(getLocalStorage("currentPage"))
    }

    const setDataItemsValue = (val: Array<ObjectType>) => {
        dataItems.value = val
        dataItemsCount.value = val.length
    }

    const setDataItemsCount = (val?: number) => {
        dataItemsCount.value = val ? val : dataItems.value.length
    }

    const setSearchItemsCount = (val: number) => {
        searchItemsCount.value = val
    }

    const setDataItemsTotal = (val: number) => {
        dataTotal.value = val
    }

    const setSavedCurrentPage = (val: number) => {
        savedCurrentPage.value = val
    }

    return {
        tableStyle, sortStyle, dataFields, dataItems, dataStats, paging, pageStart, pageLimit, currentPage,
        searchKey, dataCount, dataTotal, totalRecordsCount, pageLimits, permittedEvents, dataFetchAlert,
        setPageLimit, setSearchKeyValue, setCurrentPage, setDataItemsTotal, setDataItemsValue, setDataItemsCount,
        dataItemsCount, searchItemsCount, setSearchItemsCount, defaultTableStyle, defaultSortStyle,
        setLocalStorage, getLocalStorage, startPage, endPage, setStartPage, setEndPage, savedCurrentPage,
        setSavedCurrentPage, lastPage, setLastPage, permitSaveDelete, permitSaveDeleteMessage, getCurrentPage,
    }
}
