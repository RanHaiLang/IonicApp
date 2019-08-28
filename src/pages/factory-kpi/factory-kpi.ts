import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as echarts from 'echarts';
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {ConfigServiceProvider} from "../../providers/config-service/config-service";
import {NativeServiceProvider} from "../../providers/native-service/native-service";
import {Storage} from "@ionic/storage";
/**
 * Generated class for the FactoryKpiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-factory-kpi',
  templateUrl: 'factory-kpi.html',
})
export class FactoryKpiPage {
  counst:number=12;//人数
  autoHeight:number;//画布的高度
  mrcList:any=[];

  lastweek:number=0;//上周
  thisweek:number=0;//本周
  repaircount:number=0;//本周故障单数
  completioncount:number=0;//本周故障单完成数
  completionrate:any=0;//完成率
  pmcount:any=0;//pm工单总数
  pmcompletioncount:any=0;//pm工单完成
  pmcompletionrate:any=0;//pm完成率
  handledfaiure:any=[];//已处理故障list
  jobclosecount:any=[];//工单关闭数
  receiptcount:any=[];//接单总数
  allpersonnel:any=[];//所有人员
  handlerate:any=[];//故障处理数百分比数组

  buttonweek:boolean=true;
  username:any="";
  constructor(public navCtrl: NavController, public navParams: NavParams,public http:HttpServiceProvider,
              public config:ConfigServiceProvider,public native:NativeServiceProvider,public storage:Storage) {
    this.storage.get("username").then(username=>{
      this.username = username;
    })
    this.storage.get("usr_mrc").then((usr_mrc)=>{
      this.mrc_code = usr_mrc;
      console.log(this.mrc_code)
      this.getMrc();
      this.getKpi();
    })

  }

  totalPage:number;//总页数
  pageNum:number=1;//当前页默认1

  mrc_code:any="";
  getMrc(){
    var url =this.config.url+"appkpi/selectMrcList";
    let body = "platform=ios&token=&rows=10000&username="+this.username;
    this.http.post(url,body,false).subscribe((res)=>{
      let data = res.json();
      console.log(data['data']);
      this.mrcList = data['data']['mrcList'];
      console.log(this.mrcList);
    })
  }
  getKpi(){
    this.buttonweek = true
    var url =this.config.url+"appkpi/dataStatics";
    let body = "platform=ios&token=&evt_mrc="+this.mrc_code;
    this.http.post(url,body).subscribe((res)=>{
      let data = res.json();
      this.lastweek = data['data']['lastweek'];
      this.thisweek = data['data']['thisweek'];
      this.repaircount =data['data']['repaircount'];
      this.completioncount =data['data']['completioncount'];
      if(this.repaircount==0){
        this.completionrate =0;
      }else {
        this.completionrate = (this.completioncount/this.repaircount);
        this.completionrate = Math.round(this.completionrate*100);
      }
      this.pmcount = data['data']['pmcount'];
      this.pmcompletioncount = data['data']['pmcompletioncount'];
      if(this.pmcount==0){
        this.pmcompletionrate =0;
      }else {
        console.log(this.pmcompletioncount+":"+this.pmcount)
        this.pmcompletionrate = (this.pmcompletioncount/this.pmcount);
        this.pmcompletionrate = Math.round(this.pmcompletionrate*100);
      }
      this.handledfaiure = data['data']['handledfaiure'];
      this.allpersonnel=[];
      this.jobclosecount=[];
      this.receiptcount=[];
      this.handlerate=[];
      for(var i=0;i<this.handledfaiure.length;i++){
        this.allpersonnel.push(this.handledfaiure[i]['USR_DESC']);
        this.jobclosecount.push(this.handledfaiure[i]['CLOSINGNUMBER']);
        this.receiptcount.push(this.handledfaiure[i]['CONNECTIONNUMBER']);

        if(this.handledfaiure[i]['CONNECTIONNUMBER']==0){
          this.handlerate.push(0);
        }else {
          this.handlerate.push(Math.round((this.handledfaiure[i]['CLOSINGNUMBER']/this.handledfaiure[i]['CONNECTIONNUMBER'])*100));
        }

      }
      this.kpi();
    })
  }


  getweekhandledfailure(week){
    if(week=='thisweek'){
      this.buttonweek = true
    }else {
      this.buttonweek = false;
    }
    var url = this.config.url+"appkpi/handledfailure";
    let body = "platform=ios&token=&evt_mrc="+this.mrc_code+"&week="+week;
    this.http.post(url,body).subscribe((res)=>{
      let data = res.json();
      console.log(data);
      this.handledfaiure = data['data']['handledfaiure'];
      this.allpersonnel=[];
      this.jobclosecount=[];
      this.receiptcount=[];
      this.handlerate=[];
      for(var i=0;i<this.handledfaiure.length;i++){
        this.allpersonnel.push(this.handledfaiure[i]['USR_DESC']);
        this.jobclosecount.push(this.handledfaiure[i]['CLOSINGNUMBER']);
        this.receiptcount.push(this.handledfaiure[i]['CONNECTIONNUMBER']);

        if(this.handledfaiure[i]['CONNECTIONNUMBER']==0){
          this.handlerate.push(0);
        }else {
          this.handlerate.push(Math.round((this.handledfaiure[i]['CLOSINGNUMBER']/this.handledfaiure[i]['CONNECTIONNUMBER'])*100));
        }

      }
      this.mychat4();
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad FactoryKpiPage');
  }
  kpi() {/*当进入页面时触发*/
    const ec = echarts as any;
    var myChart1 = ec.init(document.getElementById('chart1'));
    var myChart2 = ec.init(document.getElementById('chart2'));
    var myChart3 = ec.init(document.getElementById('chart3'));
    var myChart4 = ec.init(document.getElementById('chart4'));
    // getDom() 获取 ECharts 实例容器的 dom 节点
    let chartName = ec.init(document.getElementById("chart4"));
    this.autoHeight = this.allpersonnel.length * 35 + 100; // counst.length为柱状图的条数，即数据长度。35为我给每个柱状图的高度，50为柱状图x轴内容的高度(大概的)。
    chartName.getDom().style.height = this.autoHeight + "px";
    chartName.getDom().childNodes[0].style.height = this.autoHeight + "px";
    chartName.resize();



    var optionchart1 = {
      backgroundColor: '#122e5d',
      xAxis: {
          show: false,
          type: 'category',
          data: ['Mon']
      },
      yAxis: {
          show:false,
          type: 'value'
      },
      series: [{
          type: 'bar',
          itemStyle: {
              normal: {
                  borderColor: '#559741',
                  barBorderRadius: 3,
                  color: {
                      type: "linear",
                      "x": 0,
                      "y": 0,
                      "x2": 0,
                      "y2": 1,
                      colorStops: [{
                          offset: 0,
                          color: '#2b5c37' // 0% 处的颜色
                      }, {
                          offset: 1,
                          color: '#5b844c' // 100% 处的颜色
                      }]
                  }
              },
          },
          data: [this.lastweek],
      },{
          type: 'bar',
          itemStyle: {
              normal: {
                  borderColor: '#daa44d',
                  barBorderRadius: 3,
                  color: {
                      type: "linear",
                      "x": 0,
                      "y": 0,
                      "x2": 0,
                      "y2": 1,
                      colorStops: [{
                          offset: 0,
                          color: '#814a35' // 0% 处的颜色
                      }, {
                          offset: 1,
                          color: '#817a53' // 100% 处的颜色
                      }]
                  }
              },
          },
          data: [this.thisweek],
      }]
    };
    var optionchart2 = {
        series : [
          {
            name: '类目',
            type: 'pie',
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:this.completioncount,itemStyle: {normal:{color: '#a1a876'}}},
                {value:this.repaircount,itemStyle: {normal:{color: '#818c44'}}}
            ],
          }
        ]
    };
    var optionchart3 = {
      series : [
        {
          name: '类目',
          type: 'pie',
          labelLine: {
              normal: {
                  show: false
              }
          },
          data:[
              {value:this.pmcompletioncount,itemStyle: {normal:{color: '#a1a876'}}},
              {value:this.pmcount,itemStyle: {normal:{color: '#818c44'}}}
          ],
        }
      ]
    };
    var optionchart4 = {
      // title: {
      //   text: '本周已处理故障分布情况',
      //   textStyle: {
      //     color: '#fff',
      //     fontSize: '16',
      //     fontWeight: 'normal',
      //   },
      //   left: 'center',
      //   padding: 0
      // },
      tooltip:{
        trigger: 'axis',
        axisPointer:{
          type: 'shadow'
        }
      },
      grid: {
        top: '10',
        left: '3%',
        right: '4%',
        bottom: '0',
        containLabel: true
      },
      backgroundColor: '#0a214a',
      xAxis: [{
        show: false,
        },
        {
            show: false,
        }
      ],
      yAxis: [{
        type: 'category',
        show: true,
        data: this.allpersonnel,
        inverse: true,
        axisLine: {
            show: false
        },
        splitLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            color: '#fff'
        },
      },],
      series: [
        {
          name:'接单数',
          show: true,
          type: 'bar',
          barGap: '-100%',
          barWidth: '80%', //统计条宽度
          itemStyle: {
              normal: {
                  borderColor: '#daa44d',
                  barBorderRadius: 3,
                  color: {
                    colorStops: [{
                        offset: 0,
                        color: '#817a53' // 0% 处的颜色
                    }, {
                        offset: 1,
                        color: '#814a35' // 100% 处的颜色
                    }]
                  }
              },
          },
          z: 1,
          label: {
            normal: {
                show: true,
                position: 'insideRight',
            }
          },
          data: this.receiptcount,
        },
        {
          name:'关闭数',
          show: true,
          type: 'bar',
          barGap: '-100%',
          barWidth: '80%', //统计条宽度
          itemStyle: {
              normal: {
                  borderColor: '#559741',
                  barBorderRadius: 3, //统计条弧度
                  color: {
                      colorStops: [{
                          offset: 0,
                          color: '#5b844c' // 0% 处的颜色
                      }, {
                          offset: 1,
                          color: '#2b5c37' // 100% 处的颜色
                      }],
                      globalCoord: false, // 缺省为 false
                  }
              },
          },
          max: 1,
          label: {
              normal: {
                  show: true,
                  textStyle: {
                      color: '#fff',
                  },
                  position: 'insideRight',
              }
          },
          labelLine: {
              show: false,
          },
          z: 2,
          data: this.jobclosecount,
        },
        {
          name:'百分比%',
          show: true,
          type: 'bar',
          xAxisIndex: 1, //代表使用第二个X轴刻度!!!!!!!!!!!!!!!!!!!!!!!!
          barGap: '-100%',
          barWidth: '80%', //统计条宽度
          itemStyle: {
              normal: {
                  barBorderRadius: 20,
                  color: 'rgba(22,203,115,0)'
              },
          },
          max: 1,
          label: {
              normal: {
                  show: true,
                  textStyle: {
                      color: '#fff', //百分比颜色
                  },
                  position: 'insideLeft',
                  formatter: '{c}%'
              }
          },
          labelLine: {
              show: false,
          },
          z: 3,
          data: this.handlerate//百分比的值
        }
      ]
    }

    myChart1.setOption(optionchart1);
    myChart2.setOption(optionchart2);
    myChart3.setOption(optionchart3);
    myChart4.setOption(optionchart4);
  }

  mychat4(){
    const ec = echarts as any;
    var myChart4 = ec.init(document.getElementById('chart4'));
    var optionchart4 = {
      // title: {
      //   text: '本周已处理故障分布情况',
      //   textStyle: {
      //     color: '#fff',
      //     fontSize: '16',
      //     fontWeight: 'normal',
      //   },
      //   left: 'center',
      //   padding: 0
      // },
      tooltip:{
        trigger: 'axis',
        axisPointer:{
          type: 'shadow'
        }
      },
      grid: {
        top: '10',
        left: '3%',
        right: '4%',
        bottom: '0',
        containLabel: true
      },
      backgroundColor: '#0a214a',
      xAxis: [{
        show: false,
      },
        {
          show: false,
        }
      ],
      yAxis: [{
        type: 'category',
        show: true,
        data: this.allpersonnel,
        inverse: true,
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#fff'
        },
      },],
      series: [
        {
          name:'接单数',
          show: true,
          type: 'bar',
          barGap: '-100%',
          barWidth: '80%', //统计条宽度
          itemStyle: {
            normal: {
              borderColor: '#daa44d',
              barBorderRadius: 3,
              color: {
                colorStops: [{
                  offset: 0,
                  color: '#817a53' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: '#814a35' // 100% 处的颜色
                }]
              }
            },
          },
          z: 1,
          label: {
            normal: {
              show: true,
              position: 'insideRight',
            }
          },
          data: this.receiptcount,
        },
        {
          name:'关闭数',
          show: true,
          type: 'bar',
          barGap: '-100%',
          barWidth: '80%', //统计条宽度
          itemStyle: {
            normal: {
              borderColor: '#559741',
              barBorderRadius: 3, //统计条弧度
              color: {
                colorStops: [{
                  offset: 0,
                  color: '#5b844c' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: '#2b5c37' // 100% 处的颜色
                }],
                globalCoord: false, // 缺省为 false
              }
            },
          },
          max: 1,
          label: {
            normal: {
              show: true,
              textStyle: {
                color: '#fff',
              },
              position: 'insideRight',
            }
          },
          labelLine: {
            show: false,
          },
          z: 2,
          data: this.jobclosecount,
        },
        {
          name:'百分比%',
          show: true,
          type: 'bar',
          xAxisIndex: 1, //代表使用第二个X轴刻度!!!!!!!!!!!!!!!!!!!!!!!!
          barGap: '-100%',
          barWidth: '80%', //统计条宽度
          itemStyle: {
            normal: {
              barBorderRadius: 20,
              color: 'rgba(22,203,115,0)'
            },
          },
          max: 1,
          label: {
            normal: {
              show: true,
              textStyle: {
                color: '#fff', //百分比颜色
              },
              position: 'insideLeft',
              formatter: '{c}%'
            }
          },
          labelLine: {
            show: false,
          },
          z: 3,
          data: this.handlerate//百分比的值
        }
      ]
    }
    myChart4.setOption(optionchart4,true);
  }
}
