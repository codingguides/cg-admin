import { Component } from '@angular/core';
import { HttpCallService } from '../../../common/http-call.service';

@Component({
  selector: 'app-topic-list',
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.scss']
})
export class TopicListComponent {

  topics: any = []
  errMessage:string = ""
  errFlag:boolean = true

  constructor(private commonservice: HttpCallService) {

  }

  ngOnInit(){
    this.getTopic();
  }

  async getTopic(){
    await this.commonservice.get('topic/').subscribe((res)=>{
      const apiResult = JSON.parse(JSON.stringify(res));
      console.log(typeof apiResult.payload)
      console.log(">>>>>>>>this.topics>>>>>>>>>>",apiResult.payload)

      if(apiResult && apiResult.status == "SUCCESS"){
        this.topics = apiResult && apiResult.payload;
        this.topics.map((topic:any)=>{
          console.log(topic,"===========",topic._id)
        })
        console.log(">>>>>>>>>this.topics>>>>>>>>>",this.topics)
      }else{
        this.errFlag = true;
        this.errMessage = apiResult.msg;
      }
    })
  }

  getParentName(topic:any){
    if(topic.parentDetails.length > 0){
      return topic.parentDetails[0].name;
    }
  }

  delete(topic:any){
    alert(topic.name)
  }

  edit(topic:any){
    alert(topic.name)
  }
}
