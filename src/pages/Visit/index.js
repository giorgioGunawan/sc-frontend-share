import React from 'react'
import Tabs from '../../components/Tabs'
import Product from './Product'
import VisitingReason from './VisitingReason'

const ITEMS = [
    {
        title: 'Visiting Reason',
        component: <VisitingReason />
    },
    {
        title: 'Product',
        component: <Product />
    },
]

const VisitPage = () => {
  return (
    <Tabs items={ITEMS} />
  )
}

export default VisitPage