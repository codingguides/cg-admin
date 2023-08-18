import { Component } from '@angular/core';
import { HttpCallService } from '../../../common/http-call.service';

@Component({
  selector: 'app-topic-list',
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.scss']
})
export class TopicListComponent {

  topics: any = [];
  errMessage:string = "";
  errFlag:boolean = true;
  page:number = 1; 
  limit:number = 10;
  totalPages!: number;
  currentPage!: number;
  lastElement!: number;
  parray:any = [];

  constructor(private commonservice: HttpCallService) {

  }

  ngOnInit(){
    this.getTopic();
  }

  async getTopic(){
    await this.commonservice.put({
      'page': this.page,
      'limit': this.limit
    },'topic/').subscribe((res)=>{
      const apiResult = JSON.parse(JSON.stringify(res));
      console.log(typeof apiResult.payload)
      console.log(">>>>>>>>this.topics>>>>>>>>>>",apiResult.payload)

      if(apiResult && apiResult.status == "SUCCESS"){
        this.topics = apiResult && apiResult.payload;
        this.totalPages = apiResult.totalPages;
        this.currentPage = apiResult.currentPage;
        this.parray = this.range(this.currentPage,this.totalPages);
        this.lastElement = this.parray[this.parray.length - 1];
        console.log(this.parray)
        console.log("lastElement>>",this.lastElement)
        console.log("totalPages>>",this.totalPages)
        console.log("currentPage>>",this.currentPage)
        console.log("limit>>",this.limit)
        console.log("page>>",this.page)
      }else{
        this.errFlag = true;
        this.errMessage = apiResult.msg;
      }
    })
  }

  async updateTopic(pageno:number){
    this.currentPage = pageno;
    console.log("lastElement>>",this.lastElement)
    console.log("totalPages>>",this.totalPages)
    console.log("currentPage>>",this.currentPage)
    // 
    this.page = this.limit + 10; 
    this.limit = this.limit + 1;

    console.log("limit>>",this.limit)
    console.log("page>>",this.page)

    await this.getTopic();

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


  range(start:number, end:number) {
    return Array.apply(1, Array(end))
      .map((element, index) => index + start);
  }
}
