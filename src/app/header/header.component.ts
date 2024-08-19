import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Sezioni } from '../sezione-conoscenze/switch/switch.component';
import { SwitchService } from '../sezione-conoscenze/switch/switch.service';
import { ProgettiService } from '../sezione-progetti/selettore-progetti/progetti.service';

@Component({
  selector: 'Header',
  standalone: true,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent{
  @Input("sezione-corrente")
  sezione?: string;

  @ViewChild("wrapper")
  wrapper!: ElementRef<HTMLElement>;

  @ViewChild("cella")
  cella!: ElementRef<HTMLElement>;

  @Output()
  onNaviga = new EventEmitter<string>();

  modalitaVisualizzazione: "chiaro" | "scuro";
  html = document.firstElementChild! as HTMLElement;

  constructor(
    private valore_switch: SwitchService,
    private valore_progetto: ProgettiService
  ){
    const modalita = localStorage.getItem("modalita-visualizzazione");

    if(modalita === "chiaro" || modalita === "scuro"){
      this.modalitaVisualizzazione = modalita;
    }
    else this.modalitaVisualizzazione = "scuro";
    
    this.html.classList.add(this.modalitaVisualizzazione)
  }

  sezioni = Sezioni;
  ultimo: {
    sezione?: string,
    valore?: string
  } = {}
  
  timeoutTransizione: any;
  animando: boolean = false;

  Scrolla(s: string){
    const el = document.getElementById(s)!;
    this.onNaviga.emit(s)
    el.scrollIntoView({behavior: "smooth"}); 
  }

  SezioneCorrente(sezione: string | undefined){
    if(!sezione) return 0;
    if(this.ultimo.sezione == sezione) return this.ultimo.valore; 

    const wrapper = this.wrapper.nativeElement;
    const cella = wrapper.querySelector(`[sezione="${sezione}"] .cella`)! as HTMLElement;

    const header = wrapper.parentElement! as HTMLElement;
    const offset = header.getBoundingClientRect().left;
    let valore = `${cella.getBoundingClientRect().left - offset}px`;

    this.ultimo = { sezione, valore };
    
    this.animando = true;
    clearTimeout(this.timeoutTransizione);
    this.timeoutTransizione = setTimeout(() => {
      this.animando = false;
    }, 300);

    return valore;
  }

  CambiaModalitaVisualizzazione(){
    this.modalitaVisualizzazione = this.modalitaVisualizzazione === "scuro" ? "chiaro" : "scuro";

    this.html.classList.toggle("scuro", this.modalitaVisualizzazione === "scuro");
    this.html.classList.toggle("chiaro", this.modalitaVisualizzazione === "chiaro");
  }

  SelezionaCompetenza(competenza: Sezioni){
    this.valore_switch.bottoni[competenza]?.click();
    this.Scrolla("conoscenze");
  }

  SelezionaProgetto(progetto: string){
    console.log(this.valore_progetto.bottoni)
    this.valore_progetto.bottoni[progetto]?.click()
    this.Scrolla("progetti");
  }
}
