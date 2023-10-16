# @mconnect/mc-data-table | mConnect DataTable UI Component (vue-UI component)

- Smart, Simple & Versatile UI datatable, built using vue3 composition API
- Include paging of batch records and query skip-limit to load records from backend API server / service providers
- Adjustable paging size
- Easy search to view records by search keywords
- Clear message showing the records view by query records and search keywords

- **Development & Documentation In progress**

## Installation
```npm
npm install @mconnect/mc-data-table

```

```ts
// import (include) the mc-data-table stylesheet in your application
import "@mconnect/mc-data-table/dist/style.css"

```

## Components and Features

- *screen short*
- McDataTable: entry point for defining the table options, structure and contents
- McExplorerDataTable: McDataTable subcomponent for McExplorer component (see McExplorer for details)
- McPageLimit: select the records to display per page [10, 20, 30, 50, 100, 200]
- McPageNav: page navigation features - first, last, previous, next and subset of intermediary pages
- McTable: The table structure (column / headers) and contents
- McTableMessage: indicate the current table records information, by page navigation and records total
- McTableNoData: a component to display when there are no records to display
- McTableSearch: used to filter table contents/records, by search keyword(s)

## Usage Specifications

- You may import McDataTable, McExplorerDataTable & McTableNoData as components into your UI view/page
- Dependencies: vue and w3-css

```ts
import {McDataTable, McTableNoData} from "@mconnect/mc-data-table";
import type {DataField, DataFetchAlertResult} from "@mconnect/mc-data-table"

```
- activate the mcDatatable component in your UI template, and provide the required and/or optional props

```vue

<template>
  <McDataTable v-if="dataItems.length > 0" :data-fields="dataFields" :data-items="dataItems" :data-stats="dataStats"
               :data-fetch-alert="dataFetch"></McDataTable>

</template>

<script setup lang="ts">
  import { McDataTable, McTableNoData } from "@mconnect/mc-data-table";
  import type { DataField, DataFetchAlertResult, ObjectType } from "@mconnect/mc-data-table"
  import { computed, ref } from "vue"
  import { GetRecordStats } from "./types";

  // McDataTable props
  // dataItems => records to be displayed in the mc-table | from API read request
  const dataItems = Array<ObjectType>([])
  const dataStats: GetRecordStats = ref({
    
  })
  const fetchAlertResult = ref<DataFetchAlertResult>({})

  // Data may be fetch in batches for table-records view
  // sample dataFetch for the next skip-limit records
  const dataFetch = async (val: DataFetchAlertResult) => {
    // store fetchAlertResult
    fetchAlertResult.value = val
    // perform the required read-query task using the skip and limit values from val(DataFetchAlertResult)
    if (val.fetchAlert) {
      await appStore.getAppRequest({
        skip : val.skip,
        limit: val.limit,
      })
    }
  }
  
  // McExplorerDataTable props, in addition to McDataTable


  // McTableNoData props
  // dataItems count
  // const itemsCount = ref(dataItems.length)
  const itemsCount = computed(() => {
    return dataItems.length
  })

  // Helper methods
  const isProcessing = ref(false)   // use to deactive the save-button when an active transaction is in progress
  const isMessage = ref(false)
  const pageMessage = ref("")       // to set the messages for the componenent tasks
  const itemId = ref("")    // current record ID, for update task
  const itemsIds = ref<Array<string>>([])   // for delete task
  const addItemId = (ids: Array<string>) => {
    itemsIds.value = ids
  }
  const activeLabel = (isActive: boolean) => {
    return isActive
            ? `<span>${labels.yes} <i class="fa fa-check"></i></span>`
            : `<span>${labels.no} <i class="fa fa-power-off"></i></span>`
  }
  const updateItem = async (itemRec: AppType) => {
    // Route to detail page
    await router.push({name: "appDetail", params: {itemId: itemRec.id || ""}});
  }

  const deleteResponse = async (res: RESTAPI-UserDefined_Type) =>
  {
    // handle the deleteRecord request API response
  }

  const deleteItem = async (itemId: string) => {
    isMessage.value = false;
    pageMessage.value = "";
    if (!itemId) {
      isMessage.value = true;
      pageMessage.value = "Item-ID is required to proceed";
      return;
    }
    // perform delete/remove action
    if (confirm(messages.confirmDelete)) {
      isProcessing.value = true
      isMessage.value = true;
      pageMessage.value = "Removing record.......";
      // API delete request (using axios/request helper deleteRecord function)
      const crudParams: CrudParamsType = {
        recordIds  : [itemId],
        queryParams: {},
      }
      const res = await deleteRecord(apiPaths.APP_DELETE, crudParams);
      // response
      await deleteResponse(res);
    } else {
      isProcessing.value = false
    }
  }

  // dataFields specified the specification to construct mc-data-table table header/columns and row-columns value
  // See types definition for DataField to understand the meaning of the mandatory and optional? fields
  const dataFields: Array<DataField> = [
    {
      name   : "select",
      label  : "Select",
      type   : "boolean",
      default: false,
      order  : 1,
      sort   : false,
      source : {
        type   : "checkbox",
        task   : addItemId,
        params : ["id"],
        data   : [],
        bind   : itemsIds.value,
        domComp: false
      },
      events : [{type: "change", task: addItemId, params: ["id"]}]
    },
    {
      name   : "appName",
      label  : "Application",
      type   : "string",
      default: "N/A",
      order  : 2,
      sort   : true,
      source : {type: "provider"},
    },
    {
      name   : "appTag",
      label  : "Application Tag",
      type   : "string",
      default: "N/A",
      order  : 3,
      sort   : true,
      source : {type: "provider"},
    },
    {
      name   : "appCategory",
      label  : "Application Category",
      type   : "string",
      default: "N/A",
      order  : 4,
      sort   : true,
      source : {type: "provider", transform: categoryName},
    },
    {
      name   : "accessKey",
      label  : "Access Key",
      type   : "string",
      default: "N/A",
      order  : 5,
      sort   : true,
      source : {type: "provider"},
    },
    {
      name   : "description",
      label  : "Description",
      type   : "string",
      default: "N/A",
      order  : 6,
      sort   : true,
      source : {type: "provider", transform: shortDesc},
    },
    {
      name   : "isActive",
      label  : "isActive",
      type   : "boolean",
      default: false,
      order  : 7,
      sort   : false,
      source : {type: "provider", transform: activeLabel, domComp: true},
    },
    {
      name   : "update",
      label  : "Update",
      type   : "string",
      default: "Update",
      order  : 8,
      sort   : false,
      source : {
        type   : "taskLink",
        task   : updateItem,
        params : ["item"],
        domComp: false
      },
      events : [{type: "click", action: updateItem, params: ["item"]}]
    },
    {
      name   : "delete",
      label  : "Delete",
      type   : "string",
      default: "Delete",
      order  : 10,
      sort   : false,
      source : {
        type   : "taskLink",
        task   : deleteItem,
        params : ["id"],
        domComp: false
      },
      events : [{type: "click", action: deleteItem, params: ["id"]}]
    },
  ]
  
</script>

```
- *usage example*
- Required and optional specifications
- McDataTable: *props* (required and optional)
- Required props: dataFields (Array<object>) and dataItems (Array<object>)
- Optional props: dataTotal, paging, pageStart, pageLimits (Array<number>), tableStyle, sortStyle
- *dataFields*: => dataSpecs.ts
- *dataItems*: => provider data records
  props     : {
  dataFields: {
  type    : Array,
  required: true,
  },
  dataItems : {
  type    : Array,
  required: true
  },
  dataTotal : {
  type   : Number,
  default: 0,
  },
  paging    : {
  type   : Boolean,
  default: true,
  },
  pageStart : {
  type   : Number,
  default: 1,
  },
  pageLimits: {
  type   : Array,
  default: () => [10, 20, 30, 50, 100, 200],
  },
  tableStyle: {
  type   : Object,
  default: () => {
  return {
  table      : "w3-table w3-striped w3-border w3-bordered w3-hoverable",
  tableHeader: "w3-red",
  tableBody  : "w3-hover",
  }
  },
  },
  sortStyle : {
  type   : Object,
  default: () => {
  return {
  asc : "fa fa-caret-up",
  desc: "fa fa-caret-down",
  }
  },
  },
  },
