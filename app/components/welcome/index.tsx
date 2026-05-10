'use client'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TemplateVarPanel from '../value-panel'
import s from './style.module.css'
import { AppInfoComp, ChatBtn } from './massive-component'
import type { AppInfo, PromptConfig } from '@/types/app'

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

  const handleChat = () => {
    onStartChat(inputs)
  }

  return (
    <div className='relative mobile:min-h-[48px] tablet:min-h-[64px]'>
      <div className='mx-auto pc:w-[794px] max-w-full mobile:w-full px-3.5'>
        <div className='mobile:pt-[72px] tablet:pt-[128px] pc:pt-[200px]'>
          <TemplateVarPanel isFold={false} header={<AppInfoComp siteInfo={siteInfo} />}>
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
