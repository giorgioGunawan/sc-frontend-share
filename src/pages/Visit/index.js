import React from 'react'
import { Tabs } from 'antd';
import Product from './Product'
import VisitingReason from './VisitingReason'

const ITEMS = [
    {
        key: '1',
        label: 'Visiting Reason',
        children: <VisitingReason />
    },
    {
        key: '2',
        label: 'Product',
        children: <Product />
    },
]

const VisitPage = () => {
  return (
    <Tabs style={{margin:"10px"}} defaultActiveKey="1" items={ITEMS} />
  )
}

export default VisitPage