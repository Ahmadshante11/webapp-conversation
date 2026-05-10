'use client'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TemplateVarPanel, { PanelTitle, VarOpBtnGroup } from '../value-panel'
import s from './style.module.css'
import { AppInfoComp, ChatBtn } from './massive-component'
import type { AppInfo, PromptConfig } from '@/types/app'
import Toast from '@/app/components/base/toast'
import Select from '@/app/components/base/select'
import { DEFAULT_VALUE_MAX_LEN } from '@/config'

export interface IWelcomeProps {
  conversationName: string
  hasSetInputs: boolean
  isPublicVersion: boolean
  siteInfo: AppInfo
  promptConfig: PromptConfig
  onStartChat: (inputs: Record<string, any>) => void
  canEditInputs: boolean
  savedInputs: Record<string, any>
  onInputsChange: (inputs: Record<string, any>) => void
}

const Welcome: FC<IWelcomeProps> = ({
  conversationName,
  hasSetInputs,
  siteInfo,
  promptConfig,
  onStartChat,
  savedInputs,
}) => {
  const { t } = useTranslation()
  const hasVar = promptConfig.prompt_variables.length > 0
  const [inputs, setInputs] = useState<Record<string, any>>((() => {
    if (hasSetInputs) return savedInputs
    const res: Record<string, any> = {}
    promptConfig.prompt_variables.forEach((item) => { res[item.key] = '' })
    return res
  })())

  const { notify } = Toast
  const logError = (message: string) => { notify({ type: 'error', message, duration: 3000 }) }

  const renderInputs = () => (
    <div className='space-y-3'>
      {promptConfig.prompt_variables.map(item => (
        <div className='tablet:flex items-start mobile:space-y-2 tablet:space-y-0 mobile:text-xs tablet:text-sm' key={item.key}>
          <label className={`flex-shrink-0 flex items-center tablet:leading-9 mobile:text-gray-700 tablet:text-gray-900 mobile:font-medium pc:font-normal ${s.formLabel}`}>{item.name}</label>
          {item.type === 'select' && (
            <Select
              className='w-full'
              defaultValue={inputs?.[item.key]}
              onSelect={(i) => { setInputs({ ...inputs, [item.key]: i.value }) }}
              items={(item.options || []).map(i => ({ name: i, value: i }))}
              allowSearch={false}
              bgClassName='bg-gray-50'
            />
          )}
          {item.type === 'string' && (
            <input
              placeholder={`${item.name}${!item.required ? `(${t('app.variableTable.optional')})` : ''}`}
              value={inputs?.[item.key] || ''}
              onChange={(e) => { setInputs({ ...inputs, [item.key]: e.target.value }) }}
              className={'w-full flex-grow py-2 pl-3 pr-3 box-border rounded-lg bg-gray-50'}
              maxLength={item.max_length || DEFAULT_VALUE_MAX_LEN}
            />
          )}
        </div>
      ))}
    </div>
  )

  const handleChat = () => {
    onStartChat(inputs)
  }

  return (
    <div className='relative mobile:min-h-[48px] tablet:min-h-[64px]'>
      <div className='mx-auto pc:w-[794px] max-w-full mobile:w-full px-3.5'>
        <div className='mobile:pt-[72px] tablet:pt-[128px] pc:pt-[200px]'>
          <TemplateVarPanel isFold={false} header={<AppInfoComp siteInfo={siteInfo} />}>
            {hasVar && renderInputs()}
            <ChatBtn className={hasVar ? 'mt-3 mobile:ml-0 tablet:ml-[128px]' : ''} onClick={handleChat} />
          </TemplateVarPanel>
        </div>
        <div className='mt-4 flex justify-between items-center h-8 text-xs text-gray-400'>
          <a className='flex items-center pr-3 space-x-3' href="https://medicoai.online/" target="_blank">
            <span className='uppercase'>Developed by MedcoAI</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default React.memo(Welcome)
