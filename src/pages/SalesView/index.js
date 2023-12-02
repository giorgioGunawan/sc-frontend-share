import React from 'react'
import { Tabs } from 'antd';
import Sales from './Sales'
import Import from './Import'

const ITEMS = [
    {
        key: '1',
        label: 'Employee Client Relationship View',
        children: <Sales />
    },
    {
        key: '2',
        label: 'Add Employee Client Relationship',
        children: <Import />
    },
]

const SalesView = () => {
  return (
    <Tabs style={{margin:"10px"}} defaultActiveKey="1" items={ITEMS} />
  )
}

export default SalesView