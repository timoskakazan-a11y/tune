import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Track } from './track.model';
import { TrackService } from './track.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('500ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  playlist: Track[] = [];
  currentTrackIndex = 0;
  currentTrack: Track | null = null;
  isPlaying = false;
  
  audio = new Audio();
  progress = 0;
  duration = 0;
  currentTime = 0;

  constructor(private trackService: TrackService) {}

  ngOnInit() {
    this.trackService.getTracks().subscribe(tracks => {
      this.playlist = tracks;
      if (this.playlist.length > 0) {
        this.loadTrack(this.currentTrackIndex);
      }
    });

    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('loadedmetadata', () => this.duration = this.audio.duration * 1000);
    this.audio.addEventListener('ended', () => this.nextTrack());
  }

  loadTrack(index: number) {
    this.currentTrackIndex = index;
    this.currentTrack = this.playlist[this.currentTrackIndex];
    this.audio.src = this.currentTrack.url;
    this.audio.load();
    this.progress = 0; // Reset progress bar
    this.currentTime = 0;
    this.duration = 0;
  }
  
  selectTrack(index: number) {
      this.loadTrack(index);
      this.play();
  }

  play() {
    this.isPlaying = true;
    this.audio.play();
  }

  pause() {
    this.isPlaying = false;
    this.audio.pause();
  }
  
  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
    this.loadTrack(this.currentTrackIndex);
    this.play();
  }

  prevTrack() {
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
    this.loadTrack(this.currentTrackIndex);
    this.play();
  }
  
  updateProgress() {
    this.progress = (this.audio.currentTime / this.audio.duration) * 100 || 0;
    this.currentTime = this.audio.currentTime * 1000;
  }

  seek(event: MouseEvent) {
    const progressContainer = event.currentTarget as HTMLElement;
    const width = progressContainer.clientWidth;
    const clickX = event.offsetX;
    const duration = this.audio.duration;
    this.audio.currentTime = (clickX / width) * duration;
  }
}
