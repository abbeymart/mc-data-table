<template>
  <div>
    <div v-if="tableFields.length > 0 && tableRecords.length > 0">
      <table id="mc-table-content" :class="tableStyle.table">
        <thead id="mc-table-header" :class="tableStyle.tableHeader">
        <tr>
          <th v-for="field in tableFields" :key="field.name" class="mc-tool-cursor"
              scope="col" @click.prevent="sortDataByField(field)">
            <span class="w3-left-align">{{ field.label }} </span>
            <span v-if="field.sort" class="w3-right-align"><i :class="sortStyleAsc"> </i> <i
                :class="sortStyleDesc"/>
            </span>
          </th>
        </tr>
        </thead>
        <tbody id="mc-table-body" :class="tableStyle.tableBody">
        <tr v-for="item in tableRecords" :key="item['id']">
          <td v-for="fieldItem in item.fieldsInfo" :key="fieldItem.fieldName + item['id']" class="mc-tooltip">
            <span v-if="!permitSaveDeleteTask(item['id'])" class="mc-tooltiptext">{{ permitSaveDeleteMessage }}</span>
            <input
                v-if="fieldItem.fieldSourceType === 'checkbox'"
                :disabled="!permitSaveDeleteTask(item['id'])"
                v-model="itemsIds"
                :value="item['id']"
                class="w3-check"
                type="checkbox"
                @change="fieldItem.fieldTask && fieldItem.fieldTask(itemsIds)"
            />
            <span
                v-else-if="fieldItem.fieldSourceType === 'provider' && !fieldItem.fieldSource.domComp ">{{
                item[fieldItem.fieldName]
              }}</span>
            <DatatableCustom
                v-else-if="fieldItem.fieldSourceType.startsWith('custom') && fieldItem.fieldTask"
                :item-data="item.itemRecord" :item-label="fieldItem.fieldLabel" :item-task="fieldItem.fieldTask"
                :item-type="fieldItem.fieldSourceType"/>
            <DatatableUpdate
                v-else-if="fieldItem.fieldSourceType === 'taskLink' && fieldItem.fieldTask && (fieldItem.fieldName === 'update')"
                :item-data="item.itemRecord" :item-label="fieldItem.fieldLabel" :item-task="(fieldItem.fieldTask)"/>
            <DatatableDelete
                v-else-if="fieldItem.fieldSourceType === 'taskLink' && fieldItem.fieldTask && fieldItem.fieldName === 'delete'"
                :item-id="item['id']" :item-label="fieldItem.fieldLabel" :item-task="(fieldItem.fieldTask)"/>
            <span v-else-if="fieldItem.fieldSource.domComp" v-html="fieldItem.fieldValue"/>
            <span v-else>
              <span v-for="ev in [...fieldItem.fieldEvents]" :key="ev.type">
                <span v-if="ev.type === 'click'" @click.prevent="eventHandler(item, ev)">
                  {{ fieldItem.fieldValue }}
                </span>
                <span v-else-if="ev.type === 'mouseenter'" @mouseenter.prevent="eventHandler(item, ev)">
                  {{ fieldItem.fieldValue }}
                </span>
                <span v-else-if="ev.type === 'mouseover'" @mouseover.prevent="eventHandler(item, ev)">
                  {{ fieldItem.fieldValue }}
                </span>
                <span v-else-if="ev.type === 'mouseleave'" @mouseleave.prevent="eventHandler(item, ev)">
                  {{ fieldItem.fieldValue }}
                </span>
              </span>
            </span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <McTableNoData/>
    </div>
  </div>
</template>

<script setup lang="ts">
import McTableNoData from "./McTableNoData.vue";
import DatatableUpdate from "./templates/DatatableUpdate.vue";
import DatatableDelete from "./templates/DatatableDelete.vue";
import DatatableCustom from "./templates/DatatableCustom.vue";
import { sortBy } from "lodash";
import { computed, inject, ref, unref } from "vue";
import type {
  DataField, EventType, FieldItemInfo, ItemData, ItemTaskType, ObjectType, PermitSaveDelete, PermittedEvents,
  SetDataItems, SetDataItemsTotal, SortStyle, TableStyle,
} from "./types";
import { useDatatable } from "./useDatatable";

const permitSaveDeleteMessage = inject("mcPermitSaveDeleteMessage", "Update and Delete tasks are not permitted");
const {defaultTableStyle, defaultSortStyle,} = useDatatable();
const sortAsc = ref<boolean>(true);
const sortDesc = ref<boolean>(false)
const itemsIds = ref<Array<string>>([])
const permitSaveDelete = inject<PermitSaveDelete>("mcPermitSaveDelete")
const dataItems = inject<Array<ObjectType>>("mcDataItems", [])
const dataFields = inject<Array<DataField>>("mcDataFields", [])
const pageLimit = inject<number>("mcPageLimit", 10)
const currentPage = inject<number>("mcCurrentPage", 1)
const tableStyle = inject<TableStyle>("mcTableStyle", defaultTableStyle)
const sortStyle = inject<SortStyle>("mcSortStyle", defaultSortStyle)
const searchKey = inject<string>("mcSearchKey", "")
const startPage = inject<number>("mcStartPage", 1)
const endPage = inject<number>("mcEndPage", 1)
const setDataItemsValue = inject<SetDataItems>("mcSetDataItemsValue")
const setSearchItemsCount = inject<SetDataItemsTotal>("mcSetSearchItemsCount")
const dataTotal = inject<number>("mcDataTotal")
const permittedEvents = inject<Array<PermittedEvents>>("mcPermittedEvents", ["click", "mouseover", "mouseleave",
  "mouseenter"])

const sortDataByField = (field: DataField) => {
  // toggle sort order, for dataItems.value
  if (field.sort) {
    if (sortAsc.value) {
      // sort in descending order
      const dItems = sortBy(unref(dataItems), [field.name]).reverse();
      setDataItemsValue && setDataItemsValue(dItems)
      // setDataItemsValue(dItems)
      sortAsc.value = false;
      sortDesc.value = true;
    } else {
      // sort in ascending order
      const dItems = sortBy(unref(dataItems), [field.name]);
      setDataItemsValue && setDataItemsValue(dItems)
      // setDataItemsValue(dItems)
      sortAsc.value = true;
      sortDesc.value = false;
    }
  }
}

const permitSaveDeleteFunc = unref(permitSaveDelete)

// computed values
const permitSaveDeleteTask = (itemId: string): boolean => {
  return permitSaveDeleteFunc ? permitSaveDeleteFunc(itemId) : true
}
const tableFields = computed<Array<DataField>>(() => sortBy(unref(dataFields), ["order"]))
// const dataItemsStore = computed(() => {
//   return dataItems.value
// })
const computedDataItems = computed(() => {
  // transform data-items for complete table-items search
  // const dItems = dataItems.value ? dataItems.value : dataItemsStore.value
  return unref(dataItems).map(item => {
    // clone the item for computation && original item/record
    const itemData = Object.assign({}, item, {itemRecord: {...item}});
    tableFields.value.forEach(field => {
      if (field.source.type && field.source.type === "provider") {
        if (field.source.params) {
          // compute field-param-values for the transform function
          let fieldParamValues: Array<any> = []
          for (const param of field.source.params) {
            if (param === "item" || param === "record") {
              fieldParamValues.push(itemData)
            } else {
              fieldParamValues.push(itemData[param])
            }
          }
          if (field.source.transform && typeof field.source.transform === "function") {
            itemData[field.name] = field.source.transform(...fieldParamValues);
          }
        } else if (field.source.transform && typeof field.source.transform === "function") {
          itemData[field.name] = field.source.transform(itemData[field.name]);
        }
      }
    });
    return itemData;
  });
})
// const itemsTotal = computed(() => computedDataItems.value.length)
// extract/get value from Proxy object
// const sortStyleCopy = {...sortStyle}
const sortStyleAsc = computed(() => sortAsc.value ? `${unref(sortStyle).asc} mc-table-sort-style` :
    `${unref(sortStyle).asc}`)
const sortStyleDesc = computed(() => sortDesc.value ? `${unref(sortStyle).desc} mc-table-sort-style` :
    `${unref(sortStyle).desc}`)
const searchedDataItems = computed(() => {
  // search data-items by search-key: from tableFields => Proxy[Proxy...] array-of-proxy-objects
  const dataItemKeys = tableFields.value.map(item => item.name);
  // filter the dataItems.value, by the data-item-keys
  return computedDataItems.value.filter(item => dataItemKeys.some(key => {
        if (item[key]) {
          return item[key].toString().toLowerCase().includes(unref(searchKey).toLowerCase())
        }
        return false;
      }
  ));
})
const tableItems = computed<Array<ObjectType>>(() => {
  // determine tableData for the currentPage by pageLimit
  let tableData: Array<ObjectType>;
  const pLimit = unref(pageLimit)
  let cPage = unref(currentPage)    // set current-page
  const dTotal = unref(dataTotal) || unref(dataItems).length  // set data-total for the current fetched data-items
  // scenarios for calculating tableData for the currentPage  >> mcTableBody
  const dataSize = searchedDataItems.value.length;  // data-size is the current data-searchItems-count
  // update dataItemsCount store-value
  setSearchItemsCount && setSearchItemsCount(dataSize)  // update searchItemsCount
  // if dataSize <= pageLimit: display all items for the currentPage(1)
  if (dataSize <= pLimit) {
    tableData = searchedDataItems.value;
  } else {
    // TODO: review, adjust currentPage(cPage), considering startPage, endPage & dataSize <= dataTotal
    const sPage = unref(startPage)    // start-page of the current data-items
    const ePage = unref(endPage)      // end-page of the current data-items
    // constrain currentPage
    if (cPage < sPage) {
      cPage = sPage
    }
    if (cPage > ePage) {
      cPage = ePage
    }
    // compute for searchItemsCount/dataSize < || = dataTotal
    if (dataSize < dTotal) {
      // set page-start and page-end for the searchItemsCount (dataSize)
      const pStart = 1
      const pEnd = Math.ceil(dataSize / pLimit)
      const searchPageRange = pEnd - pStart + 1 // page-range for the current search-items
      const cPageRange = cPage - sPage + 1  // current-page range, baseline with start-page for current data-items
      // position current-page within/relative to searchPageRange: 1 - 100 | 1 - 1000
      let cPageVal = pStart   // for: cPage === sPage || cPage - sPage === 0)
      // compute currentPage within data-items page-range, relative for search-items page-range
      if (cPage > sPage && cPage <= ePage) {
        // compute current-page within search-items page range
        if (cPageRange <= searchPageRange) {
          cPageVal = cPage - sPage + 1
        } else {
          // compute current-page by cPageRange and searchPageRange ratio, i.e. current-page-range > search-items page range
          const setCurrentPage = cPageRange % searchPageRange
          cPageVal = setCurrentPage === 0 ? 1 : setCurrentPage
          // compute cPageVal for the dataPageBatches, i.e. cPageRange > searchRange
        }
      }
      // compute table-data
      if (cPage === 1 || cPage == sPage) {
        // slice records from the start of currentPage up to pageLimit
        tableData = searchedDataItems.value.slice(0, pLimit)
      } else {
        // dataSize is less than the total records
        if (dataSize <= cPageVal * pLimit) {
          // slice records from the start of the currentPage to end of dataItems.value
          tableData = searchedDataItems.value.slice(((cPageVal - 1) * pLimit));
        } else {
          // slice records from the start of the currentPage to end of currentPage
          tableData = searchedDataItems.value.slice(((cPageVal - 1) * pLimit), (cPageVal * pLimit));
        }
      }
    } else {
      // compute current-page for search-items-count (dataSize) >= data-total (dTotal)
      if (cPage === 1 || cPage == sPage) {
        // slice records from the start of currentPage up to pageLimit
        tableData = searchedDataItems.value.slice(0, pLimit)
      } else {
        // set cPageVal within the page-range | 1001 - 2000, 1002 => 1002 - 1001 + 1
        const cPageVal = cPage - sPage + 1
        // dataSize is less than the total records
        if (dataSize <= cPageVal * pLimit) {
          // slice records from the start of the currentPage to end of dataItems.value
          tableData = searchedDataItems.value.slice(((cPageVal - 1) * pLimit));
        } else {
          // slice records from the start of the currentPage to end of currentPage
          tableData = searchedDataItems.value.slice(((cPageVal - 1) * pLimit), (cPageVal * pLimit));
        }
      }
    }
  }
  return tableData;
})
// compute table-records for the current-page table-items
const tableRecords = computed<Array<ItemData>>(() => {
  try {
    // transform table-items, by data-fields
    return tableItems.value.map(item => {
      // clone the item/record for transformation
      let fieldsInfo: Array<FieldItemInfo> = [];
      const itemData: ItemData = Object.assign({}, item, {fieldsInfo}, {itemRecord: item.itemRecord});
      // sort by table-field order
      tableFields.value.forEach((field) => {
        // compose the table field/column
        // column/field value

        // const defaultFunc = (param: any) => {
        //   return
        // }

        const fieldSource = field.source,
            fieldName = field.name,
            fieldType = field.type,
            fieldSourceType = field.source.type,
            fieldLabel = field.label;
        let fieldTask: ItemTaskType,
            fieldParams: ObjectType = {},
            fieldValue: any;

        if (fieldSourceType === "provider") {
          // field-value already transformed from dataItems.value computed values
          fieldValue = item[fieldName];
        } else {
          if (field.source.task) {
            fieldTask = field.source.task;
          }
          fieldParams = field.source.params as ObjectType;
        }
        fieldsInfo.push(
            {
              fieldValue     : fieldValue,
              fieldSource    : fieldSource,
              fieldType      : fieldType,
              fieldSourceType: fieldSourceType,
              fieldName      : fieldName,
              fieldTask      : fieldTask!,
              fieldParams    : fieldParams,
              fieldLabel     : fieldLabel,
              fieldEvents    : field.events ? field.events : [],
            }
        )
      });
      itemData.fieldsInfo = fieldsInfo;
      return itemData;
    });
  } catch (e) {
    console.error(e)
    console.log("error rendering table: ", e.message);
    return [];
  }
})

// eventHandler method: handles permitted events handler for item/record-fields
const eventHandler = (item: ObjectType, ev: EventType) => {
  // check permitted events
  if (unref(permittedEvents).includes(ev.type)) {
    // params
    if (ev.params && ev.params.length > 0) {
      // params-value-parsing by type
      let itemParams: any = {}
      for (const key of Object.keys(ev.params)) {
        itemParams[key] = item[key]
      }
      if (ev.task) {
        ev.task(itemParams);
      }
    }
  }
}

</script>

<style scoped>
.mc-table-sort-style {
  font-weight: bolder;
  background-color: #0D47A1;
}

</style>
