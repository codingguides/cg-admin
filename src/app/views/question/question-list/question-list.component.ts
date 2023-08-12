import { Component } from '@angular/core';
import { HttpCallService } from '../../../common/http-call.service';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent {

  questions: any = []
  errMessage:string = ""
  errFlag:boolean = true

  constructor(private commonservice: HttpCallService) {

  }

  ngOnInit(){
    this.getquestion();
  }

  async getquestion(){
    await this.commonservice.get('questions/').subscribe((res)=>{
      const apiResult = JSON.parse(JSON.stringify(res));
      console.log(typeof apiResult.payload)
      console.log(">>>>>>>>this.questions>>>>>>>>>>",apiResult.payload)

      if(apiResult && apiResult.status == "SUCCESS"){
        this.questions = apiResult && apiResult.payload;
        this.questions.map((question:any)=>{
          console.log(question,"===========",question._id)
        })
        console.log(">>>>>>>>>this.questions>>>>>>>>>",this.questions)
      }else{
        this.errFlag = true;
        this.errMessage = apiResult.msg;
      }
    })
  }

  delete(question:any){
    alert(question.point)
  }

  edit(question:any){
    alert(question.point)
  }

  removeTags(str:any) {
    if ((str===null) || (str===''))
        return false;
    else
        str = str.toString();
    return str.replace( /(<([^>]+)>)/ig, '');
  }
}
