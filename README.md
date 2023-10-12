# @mconnect/mcdatatable

- Datatable UI Component
- See test folder and other packages' test folders for test cases / scenarios and usage

## Installation
```js
npm i @mconnect/mcdatatable
```

# mConnect Datatable

- Smart UI datatable, built using vue3 composition API

## Installation

- copy the datatable folder to your application scr/component folder

## Components and Features

- *screen short*
- McDataTable: entry point for defining the table options, structure and contents
- McPageLimit: select the records per page
- McPageNav: page navigation features - first, last, previous, next and subset of intermediary pages
- McTable: The table structure (column headers) and contents
- McTableMessage: indicate the current table records information, by page navigation and records total
- McTableNoData: a component to display when there are no records to display
- McTableSearch: to filter table contents/records, by search keyword(s)

## Usage Specifications

- import mcDatatable component as a component into your UI view/page or as an app-plugin
- activate the mcDatatable component in your UI template, and provide the required and/or optional props
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
