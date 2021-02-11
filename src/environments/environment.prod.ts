const ppiApiUrl = '/cpip-api';
const iamApiUrl = '/api/iam';
export const environment = {
  production: true,
  services: {
    authen: {
      endpoint: {
        activeUesr: iamApiUrl + '/auth/sign-in',
        refreshToken: iamApiUrl + '/auth/refresh',
        getCurrentUser: iamApiUrl + '/api/user/me'
        // getCurrentUser: 'http://localhost:8080/iam/v2/api/user/me'
      }
    },
    region: {
      endpoint: {
        region: ppiApiUrl + '/api/region',
        province: {
          province: ppiApiUrl + '/api/province',
          byRegion: ppiApiUrl + '/api/province/region',
          search: ppiApiUrl + '/api/province/search'
        },
        amphur: {
          amphur: ppiApiUrl + '/api/amphur',
          byProvince: ppiApiUrl + '/api/amphur/province'
        },
        tambol: {
          tambol: ppiApiUrl + '/api/tambol',
          search: ppiApiUrl + '/api/tambol/search',
          postcode: ppiApiUrl + '/api/postcode/search'
        }
      }
    },
    stakeholder: {
      endpoint: {
        stakeholder: ppiApiUrl + '/api/stakeholder'
      }
    },
    survey: {
      endpoint: {
        survey: ppiApiUrl + '/api/survey'
      }
    },
    source: {
      endpoint: {
        source: ppiApiUrl + '/api/source',
        sourcedefault: ppiApiUrl + '/api/source/create-default'
      }
    },
    params: {
      endpoint: {
        paramGroup: ppiApiUrl + '/api/paramGroup',
        paranGroupByGroup: ppiApiUrl + '/api/param-by-group',
        paramInfo: ppiApiUrl + '/api/paramInfo',
        iamParam: iamApiUrl + '/preference/params'
      }
    },
    ppiTree: {
      endpoint: {
        ppiTree: ppiApiUrl + '/api/ppitree'
      }
    },
    sopTree: {
      endpoint: {
        ppiTree: ppiApiUrl + '/api/soptree'
      }
    },
    dataEnty: {
      endpoint: {
        monthly: {
          getCurrentMonth: ppiApiUrl + '/api/dataenty'
        },
        daily: {
          getDaily: ppiApiUrl + '/api/datadaily'
        }
      }
    },
    priceData: {
      endpoint: {
        frequency: {
          getPriceDataByFrequency: ppiApiUrl + '/api/priceData',
          neighborhood: ppiApiUrl + '/api/priceData/neighborhoodPrice',
          save: ppiApiUrl + '/api/priceData/save',
          createPriceData: ppiApiUrl + '/validata/addPriceData',
          yearTermList: ppiApiUrl + '/api/priceData/yearTerm',
          baseYearList: ppiApiUrl + '/api/priceData/baseYearTerm',
          currencyRate: ppiApiUrl + '/api/priceData/getCurrencies',
          grouplist: ppiApiUrl + '/api/priceData/group-list'
        }
      }
    },
    commodity: {
      endpoint: {
        validate: {
          inbox: ppiApiUrl + '/validata/getInbox',
          inboxDetail: ppiApiUrl + '/validata/getInboxDetail',
          calculatedCommodity: ppiApiUrl + '/calculate/commodity',
          saveCommodity: ppiApiUrl + '/save/commodity',
          calculatedWeightAndIndex: ppiApiUrl + '/calculate/weightAndIndex',
          canCalculateWeightAndIndex: ppiApiUrl + '/canCalculate/weightAndIndex',
          saveComment: ppiApiUrl + '/commodity/savecomment',
          updateRelative: ppiApiUrl + '/commodity/updateStatus',
          publishIndex: ppiApiUrl + '/index/publish',
          cancelPublish: ppiApiUrl + '/index/cancelPublish',
          cancelCalculate: ppiApiUrl + '/index/cancelCalculate',
          category: ppiApiUrl + '/api/commodity/category',
          compareCount: ppiApiUrl + '/validata/getDiff',
          createSOP: ppiApiUrl + '/sop/create',
          filterinboxDetail: ppiApiUrl + '/validata/filter',
        },
        result: {
          data: ppiApiUrl + '/api/commodity/get/result',
          year: ppiApiUrl + '/api/commodity/get/year',
          yearTermIndex: ppiApiUrl + '/api/commodity/get/year-index',
          yearTermWeight: ppiApiUrl + '/api/commodity/get/year-weight',
          export: ppiApiUrl + '/export/result/commodity',
          exportRelative: ppiApiUrl + '/export/result/relative',
          exportIndex: ppiApiUrl + '/export/result/index',
          exportWeight: ppiApiUrl + '/export/result/weight',
          exportCpaWeight: ppiApiUrl + '/export/result/cpa-weight',
          relative: ppiApiUrl + '/api/commodity/get/relative/result',
          validataMonthYear: ppiApiUrl + '/api/commodity/validate/month-year',
          weight: ppiApiUrl + '/api/commodity/get/weight/result',
          cpaResultWeight: ppiApiUrl + '/api/commodity/get/cpa-result/result',
          sopResultWeight: ppiApiUrl + '/api/commodity/get/sop-result/result',
          index: ppiApiUrl + '/api/commodity/get/index/result',
          sopWeight: ppiApiUrl + '/api/commodity/get/sop-weight/result',
          sopIndex: ppiApiUrl + '/api/commodity/get/sop-index/result',
          exportSopIndex: ppiApiUrl + '/export/result/sop-index',
          exportSopWeight: ppiApiUrl + '/export/result/sop-weight'
        }
      }
    },
    questionnaire: {
      endpoint: ppiApiUrl + '/api/questionnaire'
    },
    param: {
      endpoint: ppiApiUrl + '/api'
    },

    vparam: {
      endpoint: {
        getMenuObject: iamApiUrl + '/api/vparam'
      }
    },
    validate: {
      endpoint: ppiApiUrl + '/validata'
    },
    weight: {
      endpoint: ppiApiUrl + '/api/weight',
      export: ppiApiUrl + '/export',
      weightCalculate: ppiApiUrl + '/api/weight'

    },
    document: {
      endpoint: {
        addDocument: ppiApiUrl + '/api/addDocument',
        getDocument: ppiApiUrl + '/api/getDocument',
        getProcess: ppiApiUrl + '/api/getProcess',
        getDocumentFile: ppiApiUrl + '/api/getDocumentFile',
        downloadFile: ppiApiUrl + '/export/dowloadFile',
        priceData: ppiApiUrl + '/export/reportKeyIn',
        priceDataValidate: ppiApiUrl + '/export/exportValidateReport',
        deleteDocumentFile: ppiApiUrl + '/api/deleteDocument',
      }
    },
    baseyear: {
      endpoint: {
        maxbaseyear: ppiApiUrl + '/api/maxbaseyear',
        allBaseyear: ppiApiUrl + '/api/all-baseyear',
        ModeAllBaseyear: ppiApiUrl + '/api/mode-baseyear',
        activeBaseyear: ppiApiUrl + '/api/baseyear/get/active',
        baseyear: ppiApiUrl + '/api/baseyear',
        createBaseYear: ppiApiUrl + '/api/baseyear/create',
        weightCalculate: ppiApiUrl + '/api/weight',


      }
    },
    pkgMigrate: {
      endpoint: ppiApiUrl + '/api/migratePriceData'
    },
    paramInfo: {
      endpoint: ppiApiUrl + '/paraminfo'
    },
    dataconfig: {
      endpoint: {
        dataConfig: ppiApiUrl + '/api/dataconfig',
        getMappingDataConfig: ppiApiUrl + '/api/dataconfig/list-mapping'
      }
    },
    datamatrix: {
      endpoint: {
        datamatrix: ppiApiUrl + '/api/datamatrix'

      }
    },
    calendar: {
      endpoint: {
        calendar: ppiApiUrl + '/api/calendar'
      }
    },

    currency: {
      endpoint: {
        data: ppiApiUrl + '/api/currency/get',
        insert: ppiApiUrl + '/api/currency/insert'
      }
    },
    contact: {
      endpoint: {
        contact: ppiApiUrl + '/api/contact'
      }
    },
    workflow: {
      endpoint: {
        workflow: ppiApiUrl + '/api/workflow'
      }
    },
    indexMatrix: {
      endpoint: {
        indexMatrix: ppiApiUrl + '/indexmatrix'
      }
    },
    basePrice: {
      endpoint: {
        basePrice: ppiApiUrl + '/api/baseprice'
      }
    },
    rebase: {
      endpoint: {
        currentStage: ppiApiUrl + '/rebase/current-stage',
        nextStage: ppiApiUrl + '/rebase/next-stage',
        prevStage: ppiApiUrl + '/rebase/prev-stage',

        avgBaseWeight: ppiApiUrl + '/rebase/get-avg-base-weight',
        exportAvgBaseWeight: ppiApiUrl + '/rebase/export-avg-base-weight',
        basePrice: ppiApiUrl + '/rebase/get-base-price',
        exportBasePrice: ppiApiUrl + '/rebase/export-base-price',
        baseWeight: ppiApiUrl + '/rebase/get-base-weight',
        exportBaseWeight: ppiApiUrl + '/rebase/export-base-weight',
        exportBasePriceBar: ppiApiUrl + '/rebase/export-base-priceBar',
        baseIndex: ppiApiUrl + '/rebase/get-base-index',
        exportBaseIndex: ppiApiUrl + '/rebase/export-base-index',
        rebaseIndex: ppiApiUrl + '/rebase/get-rebase-index',
        exportRebaseIndex: ppiApiUrl + '/rebase/export-rebase-index',
        exportIndexBaseYear: ppiApiUrl + '/rebase/export-index-baseYear',
        cpaIndex: ppiApiUrl + '/rebase/get-cpa-index',
        exportCpaIndex: ppiApiUrl + '/rebase/export-cpa-index',
        cpaWeight: ppiApiUrl + '/rebase/get-cpa-weight',
        exportCpaWeight: ppiApiUrl + '/rebase/export-cpa-weight',

        sopAvgWeight: ppiApiUrl + '/rebase/get-sop-avg-weight',
        exportSopAvgWeight: ppiApiUrl + '/rebase/export-sop-avg-weight',
        sopWeight: ppiApiUrl + '/rebase/get-sop-weight',
        exportSopWeight: ppiApiUrl + '/rebase/export-sop-weight',
        sopIndex: ppiApiUrl + '/rebase/get-sop-index',
        exportSopIndex: ppiApiUrl + '/rebase/export-sop-index',
        sopAvgIndex: ppiApiUrl + '/rebase/get-sop-avg-index',
        exportSopAvgIndex: ppiApiUrl + '/rebase/export-sop-avg-index',
        sopRebaseIndex: ppiApiUrl + '/rebase/get-sop-rebase-index',
        exportSopRebaseIndex: ppiApiUrl + '/rebase/export-sop-rebase-index',
        trSopWeight: ppiApiUrl + '/rebase/get-tr-sop-weight',
        exportTrSopWeight: ppiApiUrl + '/export/export-tr-sop-weight',
        trSopIndex: ppiApiUrl + '/rebase/get-tr-sop-index',
        exportTrSopIndex: ppiApiUrl + '/rebase/export-tr-sop-index',
        avgBaseIndex: ppiApiUrl + '/rebase/get-avg-base-index',
        getRegionStep: ppiApiUrl + '/rebase/get-region-step',
        updateRegionStep: ppiApiUrl + '/rebase/update-region-proportion',
        getPublicCpiWeight: ppiApiUrl + '/rebase/get-cpi-weight-public',
        getPublicCpiIndex: ppiApiUrl + '/rebase/get-cpi-index-public',
        exportPublicCpiWeight: ppiApiUrl + '/rebase/export-weight-public',
        exportPublicCpiIndex: ppiApiUrl + '/rebase/export-index-public',
        resetRebase: ppiApiUrl + '/rebase/resetRebase'
      }
    },
    commoditySpecial: {
      endpoint: {
        update: ppiApiUrl + '/api/commodity-special/update',
        inquiryDropDown: ppiApiUrl + '/api/commodity-special/inquiry',
        inquiryCommodityList: ppiApiUrl + '/api/commodity-special/commodity/list',
        inquiryCommodityMappingList: ppiApiUrl + '/api/commodity-special/commodity/mapping/list'
      }
    },
    regionStep: {
      endpoint: {
        nextStage: ppiApiUrl + '/region-stage/next-stage',
        currentStage: ppiApiUrl + '/region-stage/current-stage'
      }
    },
    weightMapping : {
      endpoint: ppiApiUrl + '/api/weight-mapping'
    },
    export : {
      endpoint: {
        sourceCpip: ppiApiUrl + '/export/ppitree/export/sourcecpa',
        includeResultCommodity: ppiApiUrl + '/export/include/result-commodity'
      }
    }
  }

};
