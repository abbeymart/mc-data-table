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

```ts
import {McDataTable, McTableNoData} from "@mconnect/mc-data-table";
import type {DataField, DataFetchAlertResult} from "@mconnect/mc-data-table"

```
- activate the mcDatatable component in your UI template, and provide the required and/or optional props

```vue

<template>
  <McDataTable v-if="dataItems.length > 0" data-fields="" data-items="" data-stats="" data-fetch-alert=""/>

</template>

<script setup lang="ts">
  import {McDataTable, McTableNoData} from "@mconnect/mc-data-table";
  import type {DataField, DataFetchAlertResult, ObjectType} from "@mconnect/mc-data-table"
  
  import {ref} from "vue"
  // McDataTable props
  const dataItems = Array<ObjectType>([])

  // McExplorerDataTable props, in addition to McDataTable
  


  // McTableNoData props
  
  

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
