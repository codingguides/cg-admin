import { Component } from '@angular/core';
import { HttpCallService } from '../../../common/http-call.service';

@Component({
  selector: 'app-interview-list',
  templateUrl: './interview-list.component.html',
  styleUrls: ['./interview-list.component.scss']
})
export class InterviewListComponent {

  interviewList: any = []
  errMessage:string = ""
  errFlag:boolean = true

  constructor(private commonservice: HttpCallService) {

  }

  ngOnInit(){
    this.getInterview();
  }

  async getInterview(){
    // await this.commonservice.get('Interview/').subscribe((res)=>{
    //   const apiResult = JSON.parse(JSON.stringify(res));
    //   console.log(typeof apiResult.payload)
    //   console.log(">>>>>>>>this.Interviews>>>>>>>>>>",apiResult.payload)

    //   if(apiResult && apiResult.status == "SUCCESS"){
    //     this.interviews = apiResult && apiResult.payload;
    //     this.interviews.map((Interview:any)=>{
    //       console.log(Interview,"===========",Interview._id)
    //     })
    //     console.log(">>>>>>>>>this.Interviews>>>>>>>>>",this.interviews)
    //   }else{
    //     this.errFlag = true;
    //     this.errMessage = apiResult.msg;
    //   }
    // })
  }

  getParentName(Interview:any){
    if(Interview.parentDetails.length > 0){
      return Interview.parentDetails[0].name;
    }
  }

  delete(Interview:any){
    alert(Interview.name)
  }

  edit(Interview:any){
    alert(Interview.name)
  }
}
