import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PollService } from '../poll.service';
import { FormsModule } from '@angular/forms';
import { Poll } from '../poll.models';

@Component({
  selector: 'app-poll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css']
})
export class PollComponent implements OnInit {
  newPoll: Poll = {
    
    question:'',
    options:[
      {optionText:'' , voteCount:0}
    ]
  }
  polls: Poll[] = [];


  constructor(private pollService: PollService ){}

  ngOnInit(): void {
    this.loadPolls();
    
  }

  loadPolls(){
    this.pollService.getPolls().subscribe({
      next: (data) =>{
        this.polls= data;
      },
      error: (error) =>{
        console.error("Error fetching polls: ",error);
      }
    });
  }

  createPoll(){
    console.log('Poll data being sent: ', this.newPoll); // Vérifier les données envoyées
    this.pollService.createPoll(this.newPoll).subscribe({
      next: (createdPoll) =>{
        this.polls.push(createdPoll);
        this.resetPoll()
       
      },
      error: (error) =>{
        console.error("Error creating polls: ",error);
        
    } 
    });
  }

  resetPoll(){
    this.newPoll = {
      
      question:'',
      options:[
        {optionText:'' , voteCount:0},
        {optionText:'' , voteCount:0}
      ]
    };
  }

  vote(pollId: number, optionIndex: number){
    this.pollService.vote(pollId, optionIndex).subscribe({
      next: ()=> {
       const poll = this.polls.find(p => p.id === pollId);
       if(poll){
        poll.options[optionIndex].voteCount++;
       }
      },
      error:(error) =>{
        console.error("Error voting polls: ",error);
      }
      
    });
  }
  addOption(){
    this.newPoll.options.push({optionText:'' , voteCount:0});
  }

  trackByIndex(index:number):number{
    return index;
  }
}
