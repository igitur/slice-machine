import { Fragment, useState } from 'react'
import * as Widgets from 'lib/models/common/widgets/withGroup'
import EditModal from '../../common/EditModal'

import Zone from '../../common/Zone'

import { removeKeys } from 'lib/utils'
import ctBuilderArray from 'lib/models/common/widgets/ctBuilderArray'

import SliceZone from '../SliceZone'

import ModalFormCard from 'components/ModalFormCard'

const TabZone = ({
  Model,
  store,
  tabId,
  fields,
  sliceZone,
  showHints,
}) => {

  const [modaIsOpen, setModalIsOpen] = useState(false)

  const onDeleteItem = (key) => {
    store
      .tab(tabId)
      .removeWidget(key)
  }

  const getFieldMockConfig = ({ apiId }) => {
    return Model.mockConfig?.[apiId]
  }

  const onDeleteTab = () => {
    store.tab(tabId).delete()
  }

  const onSaveNewField = ({ id, widgetTypeName }) => {
    const widget = Widgets[widgetTypeName]
    if (!widget) {
      console.log(`Could not find widget with type name "${widgetTypeName}". Please contact us!`)
    }
    store
      .tab(tabId)
      .addWidget(id, {
        type: widget.TYPE_NAME,
        config: removeKeys(widget.create(id), ['id'])
      })
  }

  const onDragEnd = (result) => {
    if (!result.destination || result.source.index === result.destination.index) {
      return
    }
    if (result.source.droppableId !== result.destination.droppableId) {
      return
    }
    store.tab(tabId).reorderWidget(result.source.index, result.destination.index)
  }

  const onSave = ({ apiId, newKey, value, initialModelValues }, { initialMockConfig, mockValue }) => {
    if (mockValue && Object.keys(mockValue).length) {
      store
        .tab(tabId)
        .updateWidgetMockConfig(initialMockConfig, apiId, newKey, mockValue)
    } else {
      store
        .tab(tabId)
        .deleteWidgetMockConfig(initialMockConfig, apiId)
    }

    const widget = Widgets[initialModelValues.type]
    if (!widget) {
      return console.log(`Could not find widget with type name "${initialModelValues.type}". Please contact us!`)
    }

    if (widget.TYPE_NAME === 'Group') {
      return store
        .tab(tabId)
        .replaceWidget(
          apiId,
          newKey, {
            ...initialModelValues,
            ...value
          }
        )
    }

    store
      .tab(tabId)
      .replaceWidget(
        apiId,
        newKey,
        {
          type: initialModelValues.type,
          config: removeKeys(value, ['id', 'type'])
        }
      )
  }

  const onCreateSliceZone = () => {
    store.tab(tabId).createSliceZone()
  }

  const onDeleteSliceZone = () => {
    store.tab(tabId).deleteSliceZone()
  }

  const onSelectSharedSlices = (keys) => {
    store.tab(tabId).replaceSharedSlices(keys)
  }

  const onRemoveSharedSlice = (key) => {
    store.tab(tabId).removeSharedSlice(key)
  }

  return (
    <Fragment>
      <Zone
        tabId={tabId}
        Model={Model}
        store={store}
        title="Static Zone"
        dataTip={""}
        fields={fields}
        poolOfFieldsToCheck={Model.poolOfFieldsToCheck}
        showHints={showHints}
        EditModal={EditModal}
        widgetsArray={ctBuilderArray}
        getFieldMockConfig={getFieldMockConfig}
        onDeleteItem={onDeleteItem}
        onSave={onSave}
        onSaveNewField={onSaveNewField}
        onDragEnd={onDragEnd}
        renderHintBase={({ item }) => `data.${item.key}`}
        renderFieldAccessor={(key) => `data.${key}`}
      />
      {
        Model.tabs.length > 1 ? (
          <button onClick={() => onDeleteTab()}>Delete Tab</button>
        ) : null
      }
      <SliceZone
        tabId={tabId}
        sliceZone={sliceZone}
        onDelete={onDeleteSliceZone}
        onRemoveSharedSlice={onRemoveSharedSlice}
        onCreateSliceZone={onCreateSliceZone}
        onSelectSharedSlices={onSelectSharedSlices}
      />
      <ModalFormCard isOpen={modaIsOpen} content={{ title: 'Edit Tab'}} close={() => setModalIsOpen(false)}>
        {(props) => {
          console.log({ tabProps: props })
          return (
            <div>hello</div>
          )
        }}
      </ModalFormCard>
    </Fragment>
  )
}

export default TabZone
