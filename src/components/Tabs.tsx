import React, { useEffect, useRef, useState } from 'react'

interface TabItem {
  id: string
  label: string
  content: React.ReactNode
}

interface TabsProps {
  items: TabItem[]
}

export const Tabs: React.FC<TabsProps> = ({ items }) => {
  const tabsRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    if (tabsRef.current && window.GOVUKFrontend) {
      // Re-initialize GOV.UK Frontend components for this tabs component
      window.GOVUKFrontend.initAll()
    }
  }, [items])

  const handleTabClick = (index: number) => {
    setActiveTab(index)
  }

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    let newIndex: number

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault()
        newIndex = index > 0 ? index - 1 : items.length - 1
        break
      case 'ArrowRight':
        event.preventDefault()
        newIndex = index < items.length - 1 ? index + 1 : 0
        break
      case 'Home':
        event.preventDefault()
        newIndex = 0
        break
      case 'End':
        event.preventDefault()
        newIndex = items.length - 1
        break
      default:
        return
    }

    setActiveTab(newIndex)
    // Focus the new tab
    const newTab = tabsRef.current?.querySelector(`#tab-${items[newIndex].id}`) as HTMLElement
    newTab?.focus()
  }

  return (
    <div ref={tabsRef} className="govuk-tabs" data-module="govuk-tabs">
      <h2 className="govuk-tabs__title">Contents</h2>
      <ul className="govuk-tabs__list" role="tablist">
        {items.map((item, index) => (
          <li key={item.id} className={`govuk-tabs__list-item${index === activeTab ? ' govuk-tabs__list-item--selected' : ''}`}>
            <a
              className="govuk-tabs__tab"
              href={`#panel-${item.id}`}
              id={`tab-${item.id}`}
              role="tab"
              aria-selected={index === activeTab}
              aria-controls={`panel-${item.id}`}
              tabIndex={index === activeTab ? 0 : -1}
              onClick={(e) => {
                e.preventDefault()
                handleTabClick(index)
              }}
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`govuk-tabs__panel${index === activeTab ? '' : ' govuk-tabs__panel--hidden'}`}
          id={`panel-${item.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${item.id}`}
          hidden={index !== activeTab}
        >
          {item.content}
        </div>
      ))}
    </div>
  )
}
