"use server";

import { revalidatePath } from "next/cache";

const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8081/api/v1";

export async function createShipmentAction(payload: any) {
  try {
    // MAPEADO: El frontend usa nombres en español, el backend Java usa inglés
    // Además agregamos los campos obligatorios que el backend espera
    const backendRequest = {
      sender: {
        nombre: payload.remitente.nombre,
        telefono: payload.remitente.telefono,
        correoElectronico: payload.remitente.correoElectronico,
        direccion: payload.remitente.direccion,
        referencias: payload.remitente.referencias
      },
      recipient: {
        nombre: payload.destinatario.nombre,
        telefono: payload.destinatario.telefono,
        correoElectronico: payload.destinatario.correoElectronico,
        direccion: payload.destinatario.direccion,
        referencias: payload.destinatario.referencias
      },
      paquete: {
        peso: payload.paquete.peso,
        largo: payload.paquete.largo,
        ancho: payload.paquete.ancho,
        alto: payload.paquete.alto,
        descripcion: "Paquete estándar" // Campo opcional pero útil
      },
      tipoServicio: payload.tipoServicio.toUpperCase(), // El backend suele esperar ENUMS en mayúsculas
      nivelPrioridad: payload.tipoServicio === 'overnight' ? 5 : (payload.tipoServicio === 'express' ? 3 : 1),
      fechaEnvio: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD para LocalDate
      costoTotal: 25000.00, // Valor base para evitar errores de validación si es requerido
      instruccionesEnvio: "Manejar con cuidado"
    };

    const res = await fetch(`${backendUrl}/shipments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backendRequest),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Backend Error Status:", res.status);
      console.error("Backend Error Body:", errText);
      
      let errorMessage = "Error del servidor al crear el envío";
      try {
        const errData = JSON.parse(errText);
        if (errData.errors && Array.isArray(errData.errors)) {
          errorMessage = errData.errors.join(", ");
        } else if (errData.message) {
          errorMessage = errData.message;
        }
      } catch (e) {
        // Not JSON
      }
      throw new Error(errorMessage);
    }

    const data = await res.json();
    
    // Revalidar el dashboard para que muestre el nuevo envío inmediatamente
    revalidatePath("/");
    
    return { success: true, trackingCode: data.codigoRastreo };
  } catch (error) {
    console.error("Error en createShipmentAction:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error desconocido" 
    };
  }
}

export async function getAllShipmentsAction() {
  try {
    const res = await fetch(`${backendUrl}/shipments`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("No se pudieron cargar los envíos");
    }

    const data = await res.json();
    
    // Mapeamos al formato que espera el Dashboard
    return data.map((shipment: any) => ({
      id: shipment.codigoRastreo,
      dest: `${shipment.destinatario.direccion}`,
      state: shipment.estadoActual,
      date: new Date(shipment.fechaEnvio).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }),
      destName: shipment.destinatario.nombre,
      senderName: shipment.remitente.nombre,
    }));
  } catch (error) {
    console.error("Error en getAllShipmentsAction:", error);
    return []; // Devolver array vacío en caso de error para evitar crashes en el frontend
  }
}

export async function getTrackingAction(trackingCode: string) {
  try {
    const res = await fetch(`${backendUrl}/shipments/tracking/${trackingCode}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return { success: false, status: res.status };
    }

    const data = await res.json();

    // Mapeo de campos del Backend (Java) -> Frontend (Next.js)
    const formattedData = {
      trackingCode: data.codigoRastreo,
      estadoActual: data.estadoActual,
      remitente: {
        nombre: data.remitente.nombre,
        direccion: data.remitente.direccion,
      },
      destinatario: {
        nombre: data.destinatario.nombre,
        direccion: data.destinatario.direccion,
      },
      paquete: {
        idPaquete: data.paquete.idPaquete,
        peso: data.paquete.peso,
        largo: data.paquete.largo,
        ancho: data.paquete.ancho,
        alto: data.paquete.alto,
      },
      tipoServicio: data.tipoServicio,
      fechaEstimadaEntrega: data.fechaEstimada,
      eventos: data.eventos.map((e: any) => ({
        tipo_evento: e.tipoEvento,
        fecha_evento: e.fechaEvento,
        ubicacion: e.ubicacion,
        observaciones: e.observacion,
      })),
    };

    return { success: true, data: formattedData };
  } catch (error) {
    console.error("Error en getTrackingAction:", error);
    return { success: false, status: 500 };
  }
}
