import React from 'react'
import { Tabs } from 'antd';
import Client from './Client'
import Import from './Import'

const ITEMS = [
    {
        key: '1',
        label: 'Client View',
        children: <Client />
    },
    {
        key: '2',
        label: 'Import Client',
        children: <Import />
    },
]

const ClientView = () => {
  return (
    <Tabs style={{margin:"10px"}} defaultActiveKey="1" items={ITEMS}/>
  )
}

export default ClientView