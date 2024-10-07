import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AppStateService } from 'src/app-state.service';
import { BotonService } from 'src/services/boton.service';
import { getLuagares } from '../domain/functions'; // Import your fuzzy search function
import { EnviarTipo, Lugares, TipoAlerta } from '../domain/tipo-alerta';

@Component({
  selector: 'app-send-more-info',
  templateUrl: './send-more-info.page.html',
  styleUrls: ['./send-more-info.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class SendMoreInfoPage {
  fotoUrl: string | undefined;
  textoAEnviar: string = '';
  enviarMasInfoTipo: EnviarTipo | null = null;
  selectedLugar: string | null = null;
  suggestions: string[] = [];
  ubicacionEspecifica: string = '';
  textoMasInfo: string = '';

  constructor(
    private readonly appStateService: AppStateService,
    private readonly botonService: BotonService,
  ) {}

  EnviarTipo = EnviarTipo;
  TipoAlerta = TipoAlerta;
  tipoAlerta: TipoAlerta | null = null;
  private blobFoto: Blob | undefined;
  Lugares = Lugares;

  ionViewWillEnter() {
    this.tipoAlerta = this.appStateService.getTipoAlerta();
    this.enviarMasInfoTipo = null;
    this.appStateService.tipoAlerta.subscribe((tipo) => {
      this.tipoAlerta = tipo;
    });
    this.setTitulo();
    this.appStateService.changeBackgroundGris();
  }

  setTitulo() {
    this.appStateService.changeTitle(
      'Alerta: ' + (this.tipoAlerta?.toString() ?? ''),
    );
  }

  cancelar() {
    this.botonService.cancelarAlerta();
  }

  async tomarFotografia() {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
      presentationStyle: 'popover',
    });
    if (photo.webPath) {
      const response = await fetch(photo.webPath);
      this.blobFoto = await response.blob();
      this.fotoUrl = URL.createObjectURL(this.blobFoto);
    } else {
      throw new Error('Photo webPath is undefined');
    }
    this.enviarMasInfoTipo = EnviarTipo.FOTOGRAFIA;
  }

  especificarUbicacion() {
    this.enviarMasInfoTipo = EnviarTipo.UBICACION;
  }

  agregarMasInformacion() {
    this.enviarMasInfoTipo = EnviarTipo.MAS_INFORMACION;
  }

  cancelarEnvio() {
    this.enviarMasInfoTipo = null;
    this.suggestions = [];
    this.selectedLugar = null; // Reset selected location
  }

  // Method to handle input change and update suggestions
  onInputChange(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.getSuggestions(input); // This function should populate this.suggestions
  }

  async getSuggestions(input: string) {
    // Assuming getLuagares is an asynchronous function that returns an array of string suggestions
    this.suggestions = await getLuagares(input, 5); // Example: getting top 5 suggestions
  }

  // Method to select a suggestion
  selectSuggestion(suggestion: string) {
    this.selectedLugar = suggestion; // Update the selectedLugar with the selected suggestion
    this.suggestions = []; // Clear suggestions after selection
  }

  // Example function to handle the change in combo box (optional)
  onLugarChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedLugar = selectElement.value; // Update selectedLugar on select change
  }

  async enviarFoto() {
    if (this.blobFoto != undefined) {
      await this.botonService.sendFoto(this.blobFoto);
    }
    this.blobFoto = undefined;
    this.enviarMasInfoTipo = null;
  }
  // Send location (to be called on submit)
  async enviarUbicacion() {
    if (this.selectedLugar) {
      await this.botonService.sendUbicacion(
        this.selectedLugar,
        this.ubicacionEspecifica,
      );
    }
    this.selectedLugar = null;
    this.ubicacionEspecifica = '';
    this.enviarMasInfoTipo = null;
  }
  async enviarMasInfo() {
    await this.botonService.sendMasInfo(this.textoMasInfo);
    this.textoMasInfo = '';
    this.enviarMasInfoTipo = null;
  }
}
