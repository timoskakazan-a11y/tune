import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Track } from './track.model';

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  constructor(private http: HttpClient) { }

  getTracks(): Observable<Track[]> {
    return this.http.get('assets/tracks.txt', { responseType: 'text' })
      .pipe(
        map(text => {
          if (!text) return [];
          const tracksArray: Track[] = [];
          const tracksData = text.trim().split(/\n\s*\n/); // Split by one or more empty lines

          tracksData.forEach(trackInfo => {
            const lines = trackInfo.trim().split('\n');
            if (lines.length >= 4) {
              tracksArray.push({
                title: lines[0],
                artist: lines[1],
                cover: lines[2],
                url: lines[3],
                lyrics: lines[4] || undefined
              });
            }
          });
          return tracksArray;
        })
      );
  }
}
