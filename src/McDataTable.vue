<template>
  <div>
    <div v-if="recordTotal > 0 && dataFieldsCount > 0" class="w3-container">
      <div class="w3-row-padding">
        <div class="w3-half w3-left">
          <McPageLimit id="mc-page-limit"/>
        </div>
        <div class="w3-half w3-right">
          <McTableSearch id="mc-table-search"/>
        </div>
      </div>
      <div class="w3-panel">
        <McTable id="mc-table"/>
      </div>
      <div class="w3-row-padding">
        <div class="w3-half w3-left">
          <McTableMessage id="mc-table-message"/>
        </div>
        <div class="w3-half w3-right">
          <McPageNav id="mc-page-nav"/>
        </div>
      </div>
    </div>
    <div v-else>
      <McTableNoData/>
    </div>
  </div>
</template>

<script setup lang="ts">
// sub-components
import McPageLimit from "./McPageLimit.vue";
import McTableSearch from "./McTableSearch.vue";
import McTable from "./McTable.vue";
import McTableMessage from "./McTableMessage.vue";
import McPageNav from "./McPageNav.vue";
import McTableNoData from "./McTableNoData.vue";

import { computed, provide, ref, watch } from "vue"
import type {
  DataFetchAlert, DataField, DataStats, ObjectType, PermitSaveDelete, PermittedEvents, SortStyle, TableStyle,
} from "./types";
import { useDatatable } from "./useDatatable";

interface DataTablePropsType {
  dataFields: Array<DataField>;
  dataItems: Array<ObjectType>;
  dataStats: DataStats;
  dataFetchAlert: DataFetchAlert;
  permitSaveDelete?: PermitSaveDelete;
  permitSaveDeleteMessage?: string;
  paging?: boolean;
  pageStart?: number;
  pageLimits?: Array<number>;
  tableStyle?: TableStyle;
  sortStyle?: SortStyle;
  permittedEvents?: Array<PermittedEvents>;
  noDataMessage?: string;
  loadingDataMessage?: string;
}

const props = withDefaults(defineProps<DataTablePropsType>(), {
  permitSaveDeleteMessage: "Update and Delete tasks are not permitted",
  paging                 : true,
  pageStart              : 1,
  pageLimits             : () => [10, 20, 30, 50, 100, 200],
  tableStyle             : () => {
    return {
      table      : "w3-table w3-striped w3-border w3-bordered w3-hoverable",
      tableHeader: "w3-red",
      tableBody  : "w3-hover",
    }
  },
  sortStyle              : () => {
    return {
      asc : "fa fa-caret-up",
      desc: "fa fa-caret-down",
    }
  },
  permittedEvents        : () => ["click", "mouseover", "mouseleave", "mouseenter"],
  noDataMessage          : "No data available to display",
  loadingDataMessage     : "Loading or Unable to process data. Ensure that you're logged in",
})

// reactive params for datatable
const {
  dataFields, dataTotal, dataItemsCount, searchKey, setCurrentPage, setDataItemsCount,
  pageLimit, currentPage, tableStyle, sortStyle, dataItems, permittedEvents, setDataItemsValue,
  setSearchItemsCount, searchItemsCount, dataStats, dataFetchAlert, pageLimits, setPageLimit,
  totalRecordsCount, setSearchKeyValue, startPage, endPage, setStartPage, setEndPage,
  savedCurrentPage, setSavedCurrentPage, lastPage, setLastPage, getLocalStorage, setLocalStorage,
  permitSaveDelete, permitSaveDeleteMessage,
} = useDatatable(props)

const totalRecsCount = ref<number>(props.dataStats.totalRecordsCount || 0)

// const dStats = ref(props.dataStats)
// instance computed values, methods, lifecycles etc. | dataCount => dataItemsCount
const recordTotal = computed(() => dataTotal.value ? dataTotal.value : dataItemsCount.value)

const dataFieldsCount = computed(() => dataFields.value.length)

watch([props], async ([val]) => {
  useDatatable(val);
  setDataItemsCount();
  setCurrentPage(1)
  searchKey.value = ""
  dataItems.value = val.dataItems
  dataTotal.value = val.dataItems.length
  dataStats.value = val.dataStats
  const skip = val.dataStats.skip || 0
  const limit = val.dataStats.limit || 10000
  totalRecsCount.value = val.dataStats.totalRecordsCount || totalRecordsCount.value || 0
  const dTotal = dataTotal.value || 0
  if (skip === 0 || skip <= pageLimit.value || skip < limit) {
    setStartPage(1)
  } else {
    setStartPage(Math.ceil((skip + 1) / pageLimit.value))
  }
  setEndPage(Math.ceil((skip + dTotal) / pageLimit.value)) // endPage for the current dataFetch (skip + dataTotal)
  setLastPage(Math.ceil(totalRecsCount.value / pageLimit.value))
  dataFields.value = val.dataFields
  dataFetchAlert.value = val.dataFetchAlert
  permitSaveDelete.value = val.permitSaveDelete
  permitSaveDeleteMessage.value = val.permitSaveDeleteMessage
  pageLimits.value = val.pageLimits
  tableStyle.value = val.tableStyle
  sortStyle.value = val.sortStyle
  permittedEvents.value = val.permittedEvents
  // set the saveCurrentPage based on storedValue, relative to startPage and endPage
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
}, {immediate: true})

watch([pageLimit], ([val]) => {
  setLastPage(Math.ceil(totalRecsCount.value / val))
}, {immediate: true})


// Provide reactive items to be injected into child-components
provide("mcTableStyle", tableStyle)
provide("mcSortStyle", sortStyle)
provide("mcDataFields", dataFields)
provide("mcDataItems", dataItems)
provide("mcDataStats", dataStats)
provide("mcDataFetchAlert", dataFetchAlert)
provide("mcPermitSaveDelete", permitSaveDelete)
provide("mcPermitSaveDeleteMessage", permitSaveDeleteMessage)
provide("mcPageLimit", pageLimit)
provide("mcCurrentPage", currentPage)
provide("mcSearchKey", searchKey)
provide("mcSearchItemsCount", searchItemsCount)
provide("mcDataTotal", dataTotal)
provide("mcPageLimits", pageLimits)
provide("mcPermittedEvents", permittedEvents)
provide("mcTotalRecordsCount", totalRecordsCount)
provide("mcDataItemsCount", dataItemsCount)
provide("mcRecordTotal", recordTotal)
provide("mcStartPage", startPage)
provide("mcEndPage", endPage)
provide("mcLastPage", lastPage)
provide("mcSavedCurrentPage", savedCurrentPage)
// mutable methods
provide("mcSetStartPage", setStartPage)
provide("mcSetEndPage", setEndPage)
provide("mcSetLastPage", setLastPage)
provide("mcSetSavedCurrentPage", setSavedCurrentPage)
provide("mcSetPageLimit", setPageLimit)
provide("mcSetSearchKeyValue", setSearchKeyValue)
provide("mcSetCurrentPage", setCurrentPage)
provide("mcSetDataItemsValue", setDataItemsValue)
provide("mcSetSearchItemsCount", setSearchItemsCount)

</script>

<style scoped>

</style>


