import paymentApi from '@/apis/payment';
import { useModel } from '@@/plugin-model';
import { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { getCurrentDateTime } from '@/utils/time';
import { openNotification } from '@/utils/common';

const StuSelfPay: React.FC = () => {
  const currentDateTime = getCurrentDateTime();

  const [modalOpenForPay, setModalOpenForPay] = useState(false);
  const [weChatImgCode, setWeChatImgCode] = useState('');
  const [aliPayImgCode, setAliPayImgCode] = useState('');
  const [searchPayTime, setSearchPayTime] = useState({
    year: currentDateTime.year,
    month: currentDateTime.month,
  });
  const [payWay, setPayWay] = useState<'WECHAT' | 'ALIPAY' | 'OTHER'>('WECHAT');

  const getQRCode = () => {
    paymentApi.getWeChatPaymentCode().then((res) => {
      console.log('wechat', res);
      const wechatImgUrl = URL.createObjectURL(res);
      setWeChatImgCode(wechatImgUrl);
    });
    paymentApi.getAlipayPaymentCode().then((res) => {
      console.log('alipay', res);
      const alipayImgUrl = URL.createObjectURL(res);
      setAliPayImgCode(alipayImgUrl);
    });
  };
  const { account } = useModel('accountModel');
  const entityId = account.boundEntity?.id ?? 0;

  const payModalOpen = () => {
    setModalOpenForPay(true);
    getQRCode();
  };
  const payOk = () => {
    // const Time=new Date()
    // console.log(Time.toISOString())
    //
    // paymentApi.createPayment({
    //     studentId:entityId,
    //     year:myPaysData.year,
    //     month:myPaysData.month,
    //     total:myPaysData.total,
    //     paidDateTime:Time.toISOString(),
    //     paymentMethod:payWay,
    //     paymentType:'',
    //     description:''
    // }).then((res)=>{
    //     console.log(res)
    //     if (res.studentId){
    //         openNotification('缴费等待确认', '等待后台核对缴费数据,确认缴费是否成功,等待数个工作日')
    //         setModalOpenForPay(false)
    //     }
    // })

    setModalOpenForPay(false);
    openNotification(
      '缴费等待确认',
      '等待后台核对缴费数据,确认缴费是否成功,等待数个工作日',
    );
  };
  // const getMyPays = () => {
  //     accountApi.getStudentBill(entityId, currentDateTime.year, currentDateTime.month).then((res) => {
  //         console.log(res)
  //         setMyPaysData(res)
  //     })
  // }
  // const searchPay = () => {
  //     accountApi.getStudentBill(entityId, searchPayTime.year, searchPayTime.month).then((res) => {
  //         console.log(res)
  //         setMyPaysData(res)
  //     })
  // }
  useEffect(() => {
    // getMyPays()
  }, []);
  return (
    <div
      className="w-full flex flex-col items-center"
      style={{ margin: '50px 0' }}
    >
      {/*<div className='flex flex-row w-full justify-around'>*/}
      {/*    <div className='edit-label'>*/}
      {/*        <div className='edit-label-text'>选择年份:</div>*/}
      {/*        <Input placeholder='如:2023' type={"number"} value={searchPayTime.year} style={{height: '80%'}} onChange={(e) => {*/}
      {/*            setSearchPayTime({...searchPayTime, year: parseInt(e.target.value)})*/}
      {/*        }}/></div>*/}
      {/*    <div className='edit-label'>*/}
      {/*        <div className='edit-label-text'>选择月份:</div>*/}
      {/*        <Select style={{width: 200}} value={searchPayTime.month} options={MonthSelectOptions} onChange={(e) => {*/}
      {/*            setSearchPayTime({...searchPayTime, month: e})*/}
      {/*        }}/></div>*/}
      {/*    <div><Button size={"large"} onClick={() => {*/}
      {/*        searchPay()*/}
      {/*    }}>查询</Button></div>*/}
      {/*</div>*/}
      {/*<Divider style={{fontSize: '1.2rem'}}>缴费信息</Divider>*/}
      {/*<div className='flex flex-row w-full justify-around'>*/}
      {/*    <div className='edit-label'>*/}
      {/*        <div className='edit-label-text'>年份:</div>*/}
      {/*        <div>{myPaysData.year}</div>*/}
      {/*    </div>*/}
      {/*    <div className='edit-label'>*/}
      {/*        <div className='edit-label-text'>月份:</div>*/}
      {/*        <div>{toCn(myPaysData.month)}</div>*/}
      {/*    </div>*/}
      {/*</div>*/}
      {/*<div className='flex flex-row w-full justify-around'>*/}
      {/*    <div className='edit-label'>*/}
      {/*        <div className='edit-label-text'>缴费状态:</div>*/}
      {/*        <div>{myPaysData.isPaid ? '已缴费' : '未缴费'}</div>*/}
      {/*    </div>*/}
      {/*    <div className='edit-label'>*/}
      {/*        <div className='edit-label-text'>金额:</div>*/}
      {/*        <div>{myPaysData.total}</div>*/}
      {/*    </div>*/}
      {/*</div>*/}
      <div>
        <Button
          size={'large'}
          type={'primary'}
          onClick={() => {
            payModalOpen();
          }}
        >
          缴费
        </Button>
      </div>

      <Modal
        open={modalOpenForPay}
        style={{ minWidth: 600 }}
        onCancel={() => {
          setModalOpenForPay(false);
        }}
        onOk={() => {
          payOk();
        }}
        title={'缴费'}
        cancelText={'取消'}
        okText={'我确认已支付完成'}
      >
        {/*<div style={{display: "flex", flexDirection: 'column', alignItems: 'center', width: '100%'}}>*/}
        {/*    <Divider>*/}
        {/*        选择缴费方式*/}
        {/*    </Divider>*/}
        {/*    <Radio.Group*/}
        {/*        optionType={"button"}*/}
        {/*        value={payWay}*/}
        {/*        options={[{label: '微信支付', value: 'WECHAT'}, {label: '支付宝支付', value: 'ALIPAY'}]}*/}
        {/*        onChange={(e) => {*/}
        {/*            setPayWay(e.target.value)*/}
        {/*        }}*/}
        {/*    />*/}
        {/*    <Divider>*/}
        {/*        缴费信息*/}
        {/*    </Divider>*/}
        {/*    <div className='flex flex-row w-full justify-around'>*/}
        {/*        <div className='edit-label'>*/}
        {/*            <div className='edit-label-text'>需支付金额:</div>*/}
        {/*            <div>{myPaysData.total}</div>*/}
        {/*        </div>*/}
        {/*        <div className='edit-label'>*/}
        {/*            <div className='edit-label-text'>付款日期:</div>*/}
        {/*            <div>{currentDateTime.year+' 年 '+toCn(currentDateTime.month)+' '+currentDateTime.day+" 日"}</div>*/}
        {/*        </div>*/}
        {/*    </div>*/}

        {/*    <Divider>*/}
        {/*        付款码*/}
        {/*    </Divider>*/}
        {/*    <div><Image src={payWay == 'WECHAT' ? weChatImgCode : aliPayImgCode}/></div>*/}

        {/*</div>*/}
      </Modal>
    </div>
  );
};
export default StuSelfPay;
