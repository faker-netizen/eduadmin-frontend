import {Button, Divider, Image, Upload} from "antd";
import paymentApi from "@/apis/payment";
import {useEffect, useState} from "react";
import {UploadRequestOption} from "rc-upload/lib/interface";
import fileApi from "@/apis/file";
import {openNotification} from "@/utils/common";


const PayImage: React.FC = () => {
    const [weChatImgCode, setWeChatImgCode] = useState('')
    const [aliPayImgCode, setAliPayImgCode] = useState('')

    const getQRCode = () => {
        paymentApi.getWeChatPaymentCode().then((res) => {
            console.log('wechat',res)
            const wechatImgUrl = URL.createObjectURL(res)
            setWeChatImgCode(wechatImgUrl)
        })
        paymentApi.getAlipayPaymentCode().then((res) => {
            console.log('alipay',res)
            const alipayImgUrl = URL.createObjectURL(res)
            setAliPayImgCode(alipayImgUrl)
        })
    }
    const uploadImgForWeChat = async (options: UploadRequestOption) => {
        await paymentApi.updateWeChatPaymentCode(options.file as File)
        getQRCode()

    }
    const uploadFileForAliPay = async (options: UploadRequestOption) => {
        await paymentApi.updateAlipayPaymentCode(options.file as File)
        getQRCode()

    };
    useEffect(() => {
        getQRCode()
    }, [])
    return (
        <div>
            <Divider style={{fontSize: '1.2rem'}}>付款二维码设定</Divider>
            <div className='flex-row justify-around' style={{display: "flex", flexDirection: 'row', padding: "5%"}}>
                <div style={{width:'40%',display:"flex",flexDirection:'column',alignItems:'center'}}>
                    <div>当前微信收款二维码</div>
                    <div><Image src={weChatImgCode}/></div>
                    <Upload showUploadList={false} accept={'image/png, image/jpeg, image/jpg'} style={{width: '100%', marginTop: '3px'}} customRequest={uploadImgForWeChat}>
                        <Button size={"large"} style={{width: '100%',marginTop:5}} type="primary">修改</Button>
                    </Upload>
                </div>
                <Divider type="vertical"/>
                <div style={{width:'40%',display:"flex",flexDirection:'column',alignItems:'center'}}>
                    <div>当前支付宝收款二维码</div>
                    <div><Image src={aliPayImgCode}/></div>
                    <Upload showUploadList={false}  accept={'image/png, image/jpeg, image/jpg'} style={{width: '100%', marginTop: '3px'}}  customRequest={uploadFileForAliPay}>
                        <Button size={"large"} style={{width: '100%',marginTop:5}} type="primary">修改</Button>
                    </Upload>
                </div>
            </div>
        </div>
    )
}

export default PayImage
