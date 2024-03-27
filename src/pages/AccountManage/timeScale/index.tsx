import React, {useEffect, useState} from "react";
import presetApi, {TimescalePresetCreationRequest, TimescalePresetUpdateRequest} from "@/apis/preset";
import {Button, Drawer, Input, Timeline} from "antd";
import {defaultTimeScaleValue, getRandomColor, openNotification} from "@/utils/common";
import {defaultTimescalePreset} from "@/@types/presetDefaults";

const defaultTimeScaleUpdatePreset = {
  name: '',
  description: '',
  value: [],
}
const TimeScale = () => {
  const [timeScales, setTimeScale] = useState<Preset.TimescalePresetInfo[]>([])
  const [currentTimeScale, setCurrentTimeScale] = useState<Preset.TimescalePresetInfo>(defaultTimescalePreset)
  const [editTimeScale, setEditTimeScale] = useState<TimescalePresetUpdateRequest>(defaultTimeScaleUpdatePreset)
  const [drawerOpenForTimeEdit, setDrawerOpenForTimeEdit] = useState(false)
  const [createTimeScale, setCreateTimeScale] = useState<TimescalePresetCreationRequest>(defaultTimeScaleUpdatePreset)
  const [openForCreateTimeScale, setOpenForCreateTimeScale] = useState(false)
  const getALlTimeScale = () => {
    presetApi.getAllTimescalePresets().then((response) => {
      console.log(response)
      setTimeScale(response)
    })
  }

  const subEdit = () => {

    let req: TimescalePresetUpdateRequest = {
      value: editTimeScale.value,
    }
    if (editTimeScale.name !== currentTimeScale.name) {
      req = {
        name: editTimeScale.name,
        description: editTimeScale.description,
        value: editTimeScale.value
      }
    }
    presetApi.updateTimescalePreset(currentTimeScale.id, req).then((response) => {
      console.log(response)
      setDrawerOpenForTimeEdit(false)
      openNotification('修改课程表时间刻度', '修改成功', 'success')
      getALlTimeScale()
    })
  }
  const timeChangeForCreation = (value: string, index: number, queue: number) => {
    const newTimeScale: Array<[string, string]> = createTimeScale.value?.map((v, INDEX) => {
      let n: [string, string] = [v[0], v[1]]
      if (INDEX === index) {
        n[queue] = value
      }
      return n
    });

    setCreateTimeScale({...createTimeScale, value: newTimeScale})

  }
  const timeChangeForEdit = (value: string, index: number, queue: number) => {

    // @ts-ignore
    const newTimeScale: Array<[string, string]> = editTimeScale.value?.map((v, INDEX) => {
      let n: [string, string] = [v[0], v[1]]
      if (INDEX === index) {
        n[queue] = value
      }
      return n
    });
    console.log(newTimeScale)
    setEditTimeScale({...editTimeScale, value: newTimeScale})
  }
  const subCreate = () => {
    if (createTimeScale.name === '') {
      openNotification('新建时间轴', '时间轴名称不可为空', 'warning')
    } else {
      presetApi.createTimescalePreset(createTimeScale).then((response) => {
        console.log(response)
        openNotification('新建时间轴', '成功新建一个时间轴', 'success')
        setOpenForCreateTimeScale(false)
        getALlTimeScale()
      })
    }

  }

  useEffect(() => {
    getALlTimeScale()
  }, [])
  return (
      <div
          style={{
            padding: 30,
          }}
      >
        <div>课表时间轴设定</div>
        <div><Button
            size={"large"}
            type={"primary"}
            onClick={() => {
              setOpenForCreateTimeScale(true)
              setCreateTimeScale({...createTimeScale, value: defaultTimeScaleValue})
            }}>新建时间轴</Button></div>
        <div className={'flex flex-row'}
             style={{fontSize: '1.1rem', marginTop: '2rem', backgroundColor: 'white', padding: 30, width: '100%'}}>
          {timeScales.map((timeScale) => {
            let theItems: { children: string, color: string }[] | any[] = []
            timeScale.value.forEach((v) => {
              theItems.push({children: v[0], color: getRandomColor(v[0] + '测试')})
              theItems.push({children: v[1], color: getRandomColor(v[0] + '测试')})
            })

            return (

                <div key={timeScale.id} className={'flex flex-col items-center mr-2'}
                     style={{border: '1px solid lightgray', borderRadius: 15, width: 200}}>
                  <Button type={'primary'} className={'mt-3'} onClick={() => {
                    setEditTimeScale(timeScale)
                    setDrawerOpenForTimeEdit(true)
                    setCurrentTimeScale(timeScale)
                  }}>修改</Button>
                  <Button onClick={() => {
                    presetApi.deleteTimescalePreset(timeScale.id).then((response) => {
                      openNotification('删除时间轴', '删除时间轴成功', 'success')
                      getALlTimeScale()
                    })
                  }}>删除</Button>
                  <div className={'mt-3'}>名称: {timeScale.name}</div>
                  <div className={'mt-3'}>描述:</div>
                  <div>{timeScale.description}</div>
                  <div className={'mt-3'}>时间轴:</div>
                  <Timeline
                      className={'mt-3'}
                      items={theItems}
                  />

                </div>
            )
          })}

        </div>
        <Drawer
            title-={'修改时间轴'}
            open={drawerOpenForTimeEdit}
            contentWrapperStyle={{width: 900}}
            onClose={() => {
              setDrawerOpenForTimeEdit(false);
            }}
        >
          <div className={'w-full flex flex-col'}>

            <div className={'edit-label'}>
              <div className={'edit-label-text'}>名称:</div>
              <Input value={editTimeScale.name} onChange={(e) => {
                setEditTimeScale({...editTimeScale, name: e.target.value})
              }}/>
            </div>
            <div className={'edit-label mt-4 mb-4'}>
              <div className={'edit-label-text'}>描述:</div>
              <Input value={editTimeScale.description} onChange={(e) => {
                setEditTimeScale({...editTimeScale, description: e.target.value})
              }}/>
            </div>

            {editTimeScale.value?.map((timeGroup, index) => {

              return (
                  <div key={timeGroup[0] + timeGroup[1]} className={'flex flex-row w-1/2 items-center mt-2'}>
                    <div className={'mr-2 '} style={{width: 40}}>{index + 1}</div>
                    <div className={'flex flex-row items-center'}>
                      <Input value={timeGroup[0]} onChange={(e) => {
                        timeChangeForEdit(e.target.value, index, 0)
                      }}/>
                    </div>
                    <div>-</div>
                    <div className={'flex flex-row items-center'}>
                      <Input value={timeGroup[1]} onChange={(e) => {
                        timeChangeForEdit(e.target.value, index, 1)
                      }}/>
                    </div>
                    <Button onClick={() => {
                      const newTimeScale = editTimeScale.value?.filter((v, INDEX) => {
                        return index !== INDEX
                      })
                      setEditTimeScale({...createTimeScale, value: newTimeScale})
                    }}>删除</Button>
                  </div>
              )
            })}

            <div className="w-full flex justify-around mt-10">
              <Button
                  style={{width: '40%'}}
                  type={"primary"}
                  onClick={() => {
                    subEdit();
                  }}
              >
                提交
              </Button>
              <Button
                  style={{width: '40%'}}

                  onClick={() => {

                  }}

              >
                取消
              </Button>
            </div>


          </div>


        </Drawer>
        <Drawer
            title-={'新建时间轴'}
            open={openForCreateTimeScale}
            contentWrapperStyle={{width: 900}}
            onClose={() => {
              setOpenForCreateTimeScale(false);
            }}
        >
          <div className={'w-full flex flex-col'}>

            <div className={'edit-label'}>
              <div className={'edit-label-text'}>名称:</div>
              <Input value={createTimeScale.name} onChange={(e) => {
                setCreateTimeScale({...createTimeScale, name: e.target.value})
              }}/>
            </div>
            <div className={'edit-label mt-4 mb-4'}>
              <div className={'edit-label-text'}>描述:</div>
              <Input value={createTimeScale.description} onChange={(e) => {
                setCreateTimeScale({...createTimeScale, description: e.target.value})
              }}/>
            </div>

            {createTimeScale.value?.map((timeGroup, index) => {

              return (
                  <div key={timeGroup[0] + timeGroup[1]} className={'flex flex-row w-1/2 items-center mt-2'}>
                    <div className={'mr-2 '} style={{width: 40}}>{index + 1}</div>
                    <div className={'flex flex-row items-center'}>
                      <Input value={timeGroup[0]} onChange={(e) => {
                        timeChangeForCreation(e.target.value, index, 0)
                      }}/>
                    </div>
                    <div>-</div>
                    <div className={'flex flex-row items-center'}>
                      <Input value={timeGroup[1]} onChange={(e) => {
                        timeChangeForCreation(e.target.value, index, 1)
                      }}/>
                    </div>
                    <Button onClick={() => {
                      const newTimeScale = createTimeScale.value.filter((v, INDEX) => {
                        return index !== INDEX
                      })
                      setCreateTimeScale({...createTimeScale, value: newTimeScale})
                    }}>删除</Button>
                  </div>
              )
            })}
            <div><Button className={'ml-7 mt-4'} onClick={() => {
              const newTimeScale: Array<[string, string]> = [...createTimeScale.value, ['00:' + createTimeScale.value.length, '00:' + createTimeScale.value.length]]
              setCreateTimeScale({...createTimeScale, value: newTimeScale})
            }}>添加</Button>

            </div>

            <div className="w-full flex justify-around mt-10">
              <Button
                  style={{width: '40%'}}
                  type={"primary"}
                  onClick={() => {
                    subCreate();
                  }}
              >
                提交
              </Button>
              <Button
                  style={{width: '40%'}}

                  onClick={() => {

                  }}

              >
                取消
              </Button>
            </div>


          </div>


        </Drawer>

      </div>
  )
}
export default TimeScale;
