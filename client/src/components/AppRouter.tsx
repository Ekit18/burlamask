/* eslint-disable no-extra-parens */
import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
// import { Context } from '../index'
import { publicRoutes } from '../routes'
import { MAIN_ROUTE } from '../utils/constants'

const AppRouter = observer(() => {
  // const { user } = useContext(Context)

  return (
    <Routes>
      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
      <Route path="*" element={<Navigate to={MAIN_ROUTE} replace />} />
    </Routes>
  )
})

export default AppRouter
