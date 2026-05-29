import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { DataService, Digimon, DigimonDetail } from '../../servicios/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  digimons: Digimon[] = [];
  filteredDigimons: Digimon[] = [];
  isLoading = true;
  searchTerm = '';
  flippedCardId: number | null = null;
  detailCache: { [id: number]: DigimonDetail } = {};
  private flipTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.loadDigimons();
  }

  ngOnDestroy(): void {
    if (this.flipTimeout) clearTimeout(this.flipTimeout);
  }

  loadDigimons(): void {
    this.isLoading = true;
    this.dataService.getDigimons().subscribe({
      next: (data) => {
        this.digimons = data;
        this.filteredDigimons = data;
        this.isLoading = false;
        this.precargarDetalles(data);
      },
      error: (err) => {
        console.error('Error al cargar digimons:', err);
        this.isLoading = false;
      }
    });
  }

  private precargarDetalles(lista: Digimon[]): void {
    from(lista).pipe(
      mergeMap(d => this.dataService.getDigimonDetail(d.id), 5)
    ).subscribe({
      next: (detail) => {
        this.detailCache = { ...this.detailCache, [detail.id]: detail };
      },
      error: () => {}
    });
  }

  filterDigimons(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredDigimons = !term
      ? this.digimons
      : this.digimons.filter(d => d.name.toLowerCase().includes(term));
  }

  flipCard(digimon: Digimon): void {
    if (this.flipTimeout) {
      clearTimeout(this.flipTimeout);
      this.flipTimeout = null;
    }
    if (this.flippedCardId === digimon.id) {
      this.flippedCardId = null;
      return;
    }
    if (this.flippedCardId !== null) {
      this.flippedCardId = null;
      this.flipTimeout = setTimeout(() => {
        this.flipTimeout = null;
        this.flippedCardId = digimon.id;
      }, 560);
    } else {
      this.flippedCardId = digimon.id;
    }
  }

  goToDetail(event: Event, digimon: Digimon): void {
    event.stopPropagation();
    const cached = this.detailCache[digimon.id];
    const level = cached?.levels[0]?.level || 'Unknown';
    this.router.navigate(['/detail', digimon.name], {
      state: { digimon: { ...digimon, level } }
    });
  }

  doRefresh(event: any): void {
    if (this.flipTimeout) {
      clearTimeout(this.flipTimeout);
      this.flipTimeout = null;
    }
    this.searchTerm = '';
    this.flippedCardId = null;
    this.detailCache = {};
    this.dataService.getDigimons().subscribe({
      next: (data) => {
        this.digimons = data;
        this.filteredDigimons = data;
        event.target.complete();
        this.precargarDetalles(data);
      },
      error: () => event.target.complete()
    });
  }

  getTypesString(detail: DigimonDetail): string {
    return detail.types.map(t => t.type).join(', ') || 'N/A';
  }

  getLevel(detail: DigimonDetail): string {
    return detail.levels[0]?.level || 'N/A';
  }

  getAttribute(detail: DigimonDetail): string {
    return detail.attributes[0]?.attribute || 'N/A';
  }

  getLevelClass(id: number): string {
    const level = this.detailCache[id]?.levels[0]?.level;
    if (!level) return 'level-unknown';
    return 'level-' + level.toLowerCase().replace(/ /g, '-');
  }

  getLevelText(id: number): string {
    return this.detailCache[id]?.levels[0]?.level || '???';
  }
}
