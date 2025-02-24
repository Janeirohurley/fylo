import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, HostListener, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  imports: [CommonModule],
})
export class PlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('progressBar', { static: false }) progressBar!: ElementRef<HTMLDivElement>;
  @ViewChild('volumeBar', { static: false }) volumeBar!: ElementRef<HTMLDivElement>;
  @ViewChild('videoWrapper', { static: false }) videoWrapper!: ElementRef;

  isPlaying = false;
  isMuted = false;
  videoProgress = 0;
  isDragging = false;
  volumeLevel = 1;
  speedOptions = [0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3]; // Liste des vitesses
  currentSpeed = 1; // Vitesse par défaut
  isFullscreen = false;
  isControlsVisible = true;
  hideControlsTimeout: any;
  isVideo = true;
  fileTitle = ""

  isvisibleOptionsSpeed = false;

  private progressInterval: any;


  ngOnInit() {
    // L'élément n'est pas encore disponible ici.
  }
  ngAfterViewInit() {
    const videoElement = this.videoPlayer.nativeElement;

    // Assurez-vous que l'élément vidéo est chargé
    videoElement.addEventListener('loadeddata', () => {
      const fileName = videoElement.currentSrc.split('/').pop() || '';

      // Mettre à jour le titre avec le nom du fichier vidéo
      this.fileTitle = fileName ? `Now Playing: ${fileName}` : 'JLoading....';
      // Si le fichier est une vidéo, on aura les propriétés videoWidth et videoHeight
      if (videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
        console.log('C\'est une vidéo');
        this.isVideo = true;
      } else if (videoElement.duration && !isNaN(videoElement.duration)) {
        // Si le fichier n'est pas une vidéo mais qu'il a une durée, c'est probablement un fichier audio
        console.log('C\'est un fichier audio');
        this.isVideo = false;
      } else {
        console.log('Fichier non pris en charge');
      }
    });
  }


  ngOnDestroy() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }

  updateProgressBar() {
    if (!this.videoPlayer.nativeElement.duration) return;

    this.videoProgress = Math.ceil(
      (this.videoPlayer.nativeElement.currentTime / this.videoPlayer.nativeElement.duration) * 100
    );
  }

  togglePlay(event: Event) {
    event.stopPropagation();
    if (this.videoPlayer.nativeElement.paused) {
      this.videoPlayer.nativeElement.play();
      this.isPlaying = true;
      this.progressInterval = setInterval(() => this.updateProgressBar(), 100);
    } else {
      this.videoPlayer.nativeElement.pause();
      this.isPlaying = false;
      clearInterval(this.progressInterval);
    }
  }

  stopVideo(event: Event) {
    event.stopPropagation();
    this.videoPlayer.nativeElement.pause();
    this.videoPlayer.nativeElement.currentTime = 0;
    this.isPlaying = false;
    clearInterval(this.progressInterval);
    this.videoProgress = 0;
  }

  toggleMute(event: Event) {
    event.stopPropagation();
    this.videoPlayer.nativeElement.muted = !this.videoPlayer.nativeElement.muted;
    this.isMuted = this.videoPlayer.nativeElement.muted;

    this.volumeLevel = this.isMuted ? 0 : this.videoPlayer.nativeElement.volume;
    this.updateVolumeBar();
  }

  toggleFullscreen(event: Event) {
    event.stopPropagation();

    if (!document.fullscreenElement) {
      // Demander le mode plein écran
      this.videoWrapper.nativeElement.requestFullscreen().then(() => {
        this.isFullscreen = true;
        this.showControls();
      }).catch((err: DOMException) => {
        console.error("Erreur lors du passage en plein écran:", err);
      });
    } else {
      // Quitter le mode plein écran
      document.exitFullscreen().then(() => {
        this.isFullscreen = false;
      }).catch((err: DOMException) => {
        console.error("Erreur lors de la sortie du plein écran:", err);
      });
    }
  }


  rewind(event: Event) {
    event.stopPropagation();
    this.videoPlayer.nativeElement.currentTime -= 10;
  }

  fastForward(event: Event) {
    event.stopPropagation();
    this.videoPlayer.nativeElement.currentTime += 10;
  }

  startDrag(event: MouseEvent, isHandle = false) {
    this.isDragging = true;
    this.updateProgress(event);
  }

  @HostListener('document:mousemove', ['$event'])
  onDragging(event: MouseEvent) {
    if (this.isDragging) {
      this.updateProgress(event);
    }
  }

  @HostListener('document:mouseup')
  stopDrag() {
    this.isDragging = false;
  }

  updateProgress(event: MouseEvent) {

    if (!this.progressBar) return;

    const rect = this.progressBar.nativeElement.getBoundingClientRect();
    let offsetX = event.clientX - rect.left;
    offsetX = Math.max(0, Math.min(offsetX, rect.width));

    const newProgress = Math.ceil((offsetX / rect.width) * 100);
    this.videoProgress = newProgress;

    const newTime = (newProgress / 100) * this.videoPlayer.nativeElement.duration;
    this.videoPlayer.nativeElement.currentTime = newTime;
  }
  toggleSettings() {
    this.isvisibleOptionsSpeed = !this.isvisibleOptionsSpeed;
  }

  @HostListener('dblclick', ['$event'])
  onDoubleClick(event: MouseEvent) {
    this.toggleFullscreen(event);
  }

  setVolume(event: MouseEvent) {
    const rect = this.volumeBar.nativeElement.getBoundingClientRect();
    let newVolume = (event.clientX - rect.left) / rect.width;
    newVolume = Math.max(0, Math.min(1, newVolume)); // Clamping entre 0 et 1

    this.volumeLevel = newVolume;
    this.videoPlayer.nativeElement.volume = newVolume;
    this.videoPlayer.nativeElement.muted = newVolume === 0;
    this.isMuted = newVolume === 0;

    this.updateVolumeBar();
  }

  updateVolumeBar() {
    document.documentElement.style.setProperty('--volume', `${this.volumeLevel * 100}%`);
  }

  setPlaybackSpeed(speed: number) {
    this.videoPlayer.nativeElement.playbackRate = speed;
    this.currentSpeed = speed; // Met à jour la vitesse active
    this.isvisibleOptionsSpeed = false;
  }


  @HostListener('mousemove')
  showControls() {
    this.isControlsVisible = true;
    clearTimeout(this.hideControlsTimeout);

    this.hideControlsTimeout = setTimeout(() => {
      if (this.isFullscreen) {
        this.isControlsVisible = false;
      }
    }, 3000); // Cache après 3s
  }

  @HostListener('document:fullscreenchange')
  onFullscreenChange() {
    this.isFullscreen = !!document.fullscreenElement;
  }

}
