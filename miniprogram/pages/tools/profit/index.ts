import { pulse } from '../../../utils/haptics'

const FIELDS = [
  { key: 'rent', label: '月租金（元）' },
  { key: 'staff', label: '月人工（元）' },
  { key: 'otherCost', label: '其他固定成本（元）' },
  { key: 'price', label: '客单价（元）' },
  { key: 'customersPerDay', label: '日均客户数' },
  { key: 'grossMargin', label: '毛利率（%）' }
]

Page({
  data: {
    fields: FIELDS,
    form: {
      rent: 8000,
      staff: 12000,
      otherCost: 4000,
      price: 48,
      customersPerDay: 35,
      grossMargin: 62
    },
    result: null as any
  },

  onInput(e: any) {
    const key = e.currentTarget.dataset.key
    const value = Number(e.detail.value || 0)
    this.setData({
      [`form.${key}`]: value
    })
  },

  calculate() {
    const form = this.data.form as any
    const monthlyRevenue = form.price * form.customersPerDay * 30
    const grossProfit = monthlyRevenue * (form.grossMargin / 100)
    const fixedCost = form.rent + form.staff + form.otherCost
    const estimatedProfit = Math.round(grossProfit - fixedCost)
    const breakevenCustomers = Math.ceil(fixedCost / ((form.price * form.grossMargin) / 100) / 30)

    pulse('medium')

    this.setData({
      result: {
        monthlyRevenue,
        grossProfit: Math.round(grossProfit),
        fixedCost,
        estimatedProfit,
        breakevenCustomers
      }
    })
  }
})
