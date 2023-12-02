import React from 'react'
import Tabs from '../../components/Tabs'
import Sales from './Sales'
import Import from './Import'

const ITEMS = [
    {
        title: 'Sales View',
        component: <Sales />
    },
    {
        title: 'Import Sales',
        component: <Import />
    },
]

const SalesView = () => {
  return (
    <Tabs items={ITEMS} />
  )
}

export default SalesView