import React from 'react'
import Tabs from '../../components/Tabs'
import Client from './Client'
import Import from './Import'

const ITEMS = [
    {
        title: 'Client View',
        component: <Client />
    },
    {
        title: 'Import Client',
        component: <Import />
    },
]

const ClientView = () => {
  return (
    <Tabs items={ITEMS} />
  )
}

export default ClientView