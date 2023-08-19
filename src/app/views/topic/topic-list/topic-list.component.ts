import { Component } from '@angular/core';
import { HttpCallService } from '../../../common/http-call.service';
import Swal from 'sweetalert2';

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

  delete(topicid:any){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.commonservice.delete(`topic/delete/${topicid}`).subscribe(res => {
          const apiResult = JSON.parse(JSON.stringify(res));
          if(apiResult.status == "SUCCESS"){
            this.ngOnInit();
            swalWithBootstrapButtons.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )
          }
        })
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    })
  }


  range(start:number, end:number) {
    return Array.apply(1, Array(end))
      .map((element, index) => index + start);
  }
}
