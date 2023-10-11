<template>
  <div>
    <div v-if="pageList.length > 0" id="mcPageNav" class="w3-bar">
      <span></span>
      <a v-if="savedCurrentPage > 1 && lastPage > 1" id="mc-page-nav-first"
         class="w3-button w3-border w3-round-medium w3-hover-blue"
         href="#" @click.prevent="pageNavFirst">First</a>
      <a v-if="savedCurrentPage > 1" id="mc-page-nav-previous" class="w3-button w3-border w3-round-medium w3-hover-blue"
         href="#"
         @click.prevent="pageNavPrevious">&laquo;Previous</a>
      <a v-for="page in pageList" :key="page" class="w3-button w3-border w3-round-medium w3-hover-blue" href="#"
         @click.prevent="pageNavNumber(page)">
        <span v-if="savedCurrentPage.toString() === page" class="mc-current-page">{{ page }}</span>
        <span v-else>{{ page }}</span>
      </a>
      <a v-if="savedCurrentPage < lastPage && lastPage > 1" id="mc-page-nav-next"
         class="w3-button w3-border w3-round-medium w3-hover-blue"
         href="#" @click.prevent="pageNavNext">Next&raquo;</a>
      <a v-if="savedCurrentPage < lastPage" id="mc-page-nav-last"
         class="w3-button w3-border w3-round-medium w3-hover-blue"
         href="#" @click.prevent="pageNavLast">Last</a>
    </div>
    <div v-else>No record(s) to navigate</div>
  </div>
</template>

<script setup lang="ts">

import { computed, inject, ref, unref } from "vue"
import type { DataFetchAlert, DataFetchAlertResult, DataStats, SetCurrentPage, SetSearchKey } from "./types";
import { useDatatable } from "./useDatatable";

const {setLocalStorage, getLocalStorage} = useDatatable()
let pagePosition = ref<string>("")
const startPage = inject<number>("mcStartPage", 1)
const endPage = inject<number>("mcEndPage", 1)
const setStartPage = inject<SetCurrentPage>("mcSetStartPage")
const setEndPage = inject<SetCurrentPage>("mcSetEndPage")
const dataTotal = inject<number>("mcDataTotal", 0)
const pageLimit = inject<number>("mcPageLimit", 10)
const currentPage = inject<number>("mcCurrentPage", 1)
const lastPage = inject("mcLastPage", 1)
const dataStats = inject<DataStats>("mcDataStats", {})
const dataFetchAlert = inject<DataFetchAlert>("mcDataFetchAlert")
const setCurrentPage = inject<SetCurrentPage>("mcSetCurrentPage")
const totalRecordsCount = inject<number>("mcTotalRecordsCount", 0)
const savedCurrentPage = inject<number>("mcSavedCurrentPage", 1)
const setSavedCurrentPage = inject<SetCurrentPage>("mcSetSavedCurrentPage")
const setSearchKeyValue = inject<SetSearchKey>("mcSetSearchKeyValue")
// methods: set searchKey
const updateSearchKey = (val: string) => setSearchKeyValue && setSearchKeyValue(val)


// computed values
// const lastPage = computed(() => Math.ceil(unref(totalRecordsCount) / unref(pageLimit)))
const pageList = computed(() => {
  // handle the case where searchItemsCount.value < 1 (i.e. empty/zero-records)
  if (unref(totalRecordsCount) < 1) {
    updateCurrentPage(1)
    return [];
  }
  // compute other scenarios
  let pageLimitVal = unref(pageLimit);
  let lPage = unref(lastPage);
  if (unref(totalRecordsCount) < pageLimitVal) {
    updateCurrentPage(1)
  }
  // pageNav scenarios
  // handle case where totalRecordsCount < 1
  // [First][Previous]...pages...[Next][Last]
  // show all pages, if lastPage <= 7 : i.e. 1...lastPage
  // render pages: show first(1) and last(30) pages, show first five pages if currentPage: 1 2 3 4
  // for currentPage: 5 to lastPage-4, i.e. 1 ... three pages from currentPage ... 30
  // show 1 ... 5 6 7 ... 30
  // for currentPage: lastPage-4, -3, -2, -1, lastPage
  // show: 1 ... 26 27 28 29 30
  let pageList: Array<string> = [];
  if (lPage <= 9) {
    let i = 1;
    while (i <= lPage) {
      pageList.push(i.toString());
      i++;
    }
  }
  if (lPage > 9) {
    const cPage = unref(savedCurrentPage)
    if ([1, 2, 3, 4].includes(cPage)) {
      pageList = ["1", "2", "3", "4", "5", "....", (lPage - 2).toString(), (lPage - 1).toString(),
        lPage.toString()];
    } else if (cPage > 4 && cPage < lPage - 3) {
      pageList = ["1", "2", "3", "...", (cPage - 1).toString(), cPage.toString(), (cPage + 1).toString(), "....",
        lPage.toString()];
    } else if (cPage >= lPage - 4) {
      pageList = ["1", "2", "3", "...", (lPage - 4).toString(), (lPage - 3).toString(), (lPage - 2).toString(),
        (lPage - 1).toString(), lPage.toString()];
    }
  }
  return pageList;
})

// methods
const setCurrentPageFunc = unref(setCurrentPage)
const dataFetchAlertFunc = unref(dataFetchAlert)
const setStartPageFunc = unref(setStartPage)
const setEndPageFunc = unref(setEndPage)
const updateCurrentPage = (val: number) => setCurrentPageFunc && setCurrentPageFunc(val)
const updateDataFetchAlert = (val: DataFetchAlertResult) => dataFetchAlertFunc && dataFetchAlertFunc(val)
const updateStartPage = (val: number) => setStartPageFunc && setStartPageFunc(val)
const updateEndPage = (val: number) => setEndPageFunc && setEndPageFunc(val)
const updateSavedCurrentPage = (val: number) => setSavedCurrentPage && setSavedCurrentPage(val)

// dataFetchAlertComputation sends alert to fetch/page new records (via updateDataFetchAlert),
// if currentPage is out-of-current-data-batch-range
const dataFetchAlertComputation = () => {
  // determine start and end page for the current data-batch (skip/limit(dataTotal.value))
  const dTotal = unref(dataTotal)
  let skip = unref(dataStats).skip || 0;
  let limit = unref(dataStats).limit || dTotal;
  // let pageLimitVal = unref(pageLimit);
  // compute page-range for the current data-records-batch | startPage and endPage
  const getCurrentPage = getLocalStorage("currentPage")
  const currentPageVal = getCurrentPage && parseInt(getCurrentPage) || unref(savedCurrentPage) || unref(currentPage)
  if (skip === 0 || skip <= unref(pageLimit) || skip < limit) {
    updateStartPage(1);
  } else {
    updateStartPage(Math.ceil((skip + 1) / unref(pageLimit)))
  }
  updateEndPage(Math.ceil((skip + dTotal) / unref(pageLimit)));   // endPage for the current dataFetch (skip + dataTotal)
  // set skip value for the next (or previous) batch of data-records-fetch
  if (currentPageVal < unref(startPage)) {
    skip = (skip - limit) <= 0 ? 0 : (skip - limit);
  } else if (currentPageVal > unref(endPage)) {
    skip = skip + limit;
  }
  // set the dataFetchAlertResult object
  const val: DataFetchAlertResult = {
    skip        : skip,
    limit       : limit,
    fetchAlert  : true,
    currentStats: {
      startPage     : unref(startPage),
      endPage       : unref(endPage),
      currentPage   : currentPageVal,
      dataItemsTotal: unref(totalRecordsCount) || limit,
    }
  }
  // re-compose the condition for dataFetchAlert
  if (currentPageVal < unref(startPage) || currentPageVal > unref(endPage)) {
    updateSearchKey("") // reset searchKey
    updateDataFetchAlert(val)
  }
}

const pageNavFirst = () => {
  pagePosition.value = "first-page"
  updateCurrentPage(1)
  updateSavedCurrentPage(1)
  setLocalStorage("currentPage", 1)
  dataFetchAlertComputation()
}
const pageNavPrevious = () => {
  pagePosition.value = "previous-page"
  const sPage = unref(startPage)
  const ePage = unref(endPage)
  const sCPage = getLocalStorage("currentPage")
  let cPage = sCPage && parseInt(sCPage) || unref(savedCurrentPage) || unref(currentPage)
  let setPage;
  if (cPage < sPage) {
    setPage = sPage
  } else if (cPage > ePage) {
    setPage = ePage
  } else {
    setPage = cPage - 1
  }
  updateCurrentPage(setPage)
  updateSavedCurrentPage(setPage)
  setLocalStorage("currentPage", setPage)
  dataFetchAlertComputation()
}
const pageNavNext = () => {
  pagePosition.value = "next-page"
  const sPage = unref(startPage)
  const ePage = unref(endPage)
  const sCPage = getLocalStorage("currentPage")
  let cPage = sCPage && parseInt(sCPage) || unref(savedCurrentPage) || unref(currentPage)
  let setPage;
  if (cPage < sPage) {
    setPage = sPage
  } else if (cPage > ePage) {
    setPage = ePage
  } else {
    setPage = cPage + 1
  }
  updateCurrentPage(setPage)
  updateSavedCurrentPage(setPage)
  setLocalStorage("currentPage", setPage)
  dataFetchAlertComputation()
}
const pageNavLast = () => {
  pagePosition.value = "last-page"
  const lPage = unref(lastPage)
  updateCurrentPage(lPage)
  updateSavedCurrentPage(lPage)
  setLocalStorage("currentPage", lPage)
  dataFetchAlertComputation()
}
const pageNavNumber = (page: string) => {
  pagePosition.value = "page-number"
  const sPage = unref(startPage)
  const ePage = unref(endPage)
  const sCPage = getLocalStorage("currentPage")
  let cPage = sCPage && parseInt(sCPage) || unref(savedCurrentPage)
  let setPage;
  if (page === "....") {
    if (cPage < sPage) {
      setPage = sPage
    } else if (cPage > ePage) {
      setPage = ePage
    } else {
      setPage = cPage + 1
    }
  } else if (page === "...") {
    if (cPage < sPage) {
      setPage = sPage
    } else if (cPage > ePage) {
      setPage = ePage
    } else if (cPage === 1) {
      // can't decrement below 1
      setPage = 1
    } else {
      setPage = cPage - 1
    }
  } else {
    setPage = parseInt(page)
  }
  updateCurrentPage(setPage)
  updateSavedCurrentPage(setPage)
  setLocalStorage("currentPage", setPage)
  dataFetchAlertComputation()
}

</script>

<style scoped>
#mcPageNav a {
  color: #0D47A1;
}

#mcPageNav a:hover {
  font-weight: bolder;
  background-color: #0D47A1;
}

#mcPageNav a:active {
  font-weight: bolder;
  background-color: #0c5460;
}

.mc-current-page {
  font-weight: bolder;
  text-decoration: underline;
}

</style>
