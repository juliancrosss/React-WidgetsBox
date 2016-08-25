//require("./node_modules/bootstrap/dist/css/bootstrap.min.css")
import React from 'react';
import ReactDOM from 'react-dom';

var oTable;
var json_data = [];
var data;
var consecutivo_solicitud;

var Id_asignacion;
var Tipo_vehiculo;
var Hora_inicio ;
var Hora_fin ;
var Fecha_cita;
var  Origen;
var Destino;
var Tipo_operacion;
var Placa;
var  Placa_trayler;
var No_documento_conductor;
var No_contrato;
var estado;
var cedi;
var no_Contrato;
var funcion_cargar_modal;
var funcion_conductor;
var funcion_destinatario;
var funcion ;
var funcion_trayler;
var disabled;
var idVehiculo_consecutivo;
var direccion_url_asignar;
var direccion_url_despachar;
var vehiculoAsignado
var id_data_peticion, verificar_campos, boton_asignar, vehiculo_despachado, cambio_estado, cambiar_estado_ultimo;

/**************************widgetBox**************************************/
var WidgetsBox = React.createClass({
  getInitialState: function() {
    return {cedi_para_tabla: ''};
  },
  handleEmpresaClicked: function(event){
    $("#cedi_actual_en_la_tabla").val(event)
    var texto = event;
    var self = this;
    $.ajax({
        type: 'POST',
        url: 'querys/consultar/consultar_solicitud_vehiculo_para_asignar.php',
        data: 'texto=' + texto,
        success: function(respuesta) {
          respuesta = JSON.parse(respuesta);
          var cedi_para_tabla = respuesta.cedi;
          $("#carga_tabla_asignacion_vehiculo").html("")
          //console.log(cedi_para_tabla)
          self.setState({cedi_para_tabla: cedi_para_tabla})
          ReactDOM.render(React.createElement(Table, { cedi_cargar: self.state.cedi_para_tabla }), document.getElementById('carga_tabla_asignacion_vehiculo'));
          //cargar_tabla_por_cedi(cedi_para_tabla);
        }
      });
  },
  render: function() {
    var self = this;
    var widgetsNodes = this.props.data.map(function(comment) {

      return (
        <div className="col-lg-2" onClick={self.handleEmpresaClicked.bind(self,comment)}>
        <div className="widget style1 navy-bg">
          <div className="row vertical-align">
                <div className="col-xs-3">
                    {/*<i className="fa fa-rss fa-3x"></i>*/}
                  </div>
                  <div className="col-xs-9 text-right">
                    <h6 className="font-bold">{comment}</h6>
                  </div>
              </div>
          </div>
        </div>
      );
    });
    return (
      <div>
        {widgetsNodes}
      </div>
    );
  }
});
var Box = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  componentWillMount: function() {
    $.ajax({
      url: 'querys/proceso_vehicular/consultar/consultar_empresas_solicitud.php',
        dataType: 'json',
        cache: false,
        success: function(data) {
          this.setState({data: data});
          console.log(data)
        }.bind(this),
          error: function(xhr, status, err) {
            //console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
  },
  render: function() {
    return (
      <div>
        <WidgetsBox data={this.state.data} />
          </div>
        );
  }
});
ReactDOM.render(
  <Box />,
  document.getElementById('widgetBox')
);
/**************************widgetBox**************************************/
/*FUNCION PARA LE EMPRESA SELECIONADO*/
/*function cedi_clicked(cedi){
  var texto = cedi;
  $("#cedi_actual_en_la_tabla").val(cedi);
  $.ajax({
    type: 'POST',
    url: 'querys/consultar/consultar_solicitud_vehiculo_para_asignar.php',
    data: 'texto=' + texto,
    success: function(respuesta) {
      respuesta = JSON.parse(respuesta);
      var cedi_para_tabla = respuesta.cedi;
      //$("#carga_tabla_asignacion_vehiculo").html(respuesta.cargar_tabla);
      $("#carga_tabla_asignacion_vehiculo").html("")
      ReactDOM.render(React.createElement(Table, null), document.getElementById('carga_tabla_asignacion_vehiculo'));
      cargar_tabla_por_cedi(cedi_para_tabla);
    }
  });
}*/

/******************************COMPONENTE TABLA*******************************************************/
var Table = React.createClass({
  componentDidMount: function(){
    console.log(this.props.cedi_cargar)
  oTable = $('#editable').DataTable({
    responsive: true,
    "language": {
      "url": "js/scripts/tablas/tables_spanish.json"
    }, 
    "processing": true,
    data: this.props.cedi_cargar,
    "pageLength": 5,
    "scrollX": true,
    "columnDefs": [ 
    {
      "targets": 0,
      "data": "Origen",
      "render": function ( data, type, full, meta ) {
        Id_asignacion = full.Id_asignacion;
        Tipo_vehiculo = full.Tipo_vehiculo;
        Hora_inicio = full.Hora_inicio;
        Hora_fin = full.Hora_fin;
        Fecha_cita = full.Fecha_cita;
        Origen = full.Origen;
        Destino = full.Destino;
        Tipo_operacion = full.Tipo_operacion;
        Placa = full.Placa;
        Placa_trayler = full.Placa_trayler;
        No_documento_conductor= full.No_documento_conductor;
        No_contrato = full.No_contrato;
        estado = full.Estado;
        cedi = full.Cedi;
        no_Contrato = full.No_contrato;
        funcion_cargar_modal = "cargar_infocarga_viaje('"+Id_asignacion+"');"
        funcion_conductor = "buscar_conductor_asignado('"+Id_asignacion+"');"
        funcion_destinatario = "buscar_destinatario('"+Id_asignacion+"');"
        if(estado == "Asignar"){
          return '<a style="display: block" class="client-link origen_'+Id_asignacion+'">'+data+'</a><input type="hidden" id="origen_contrato_'+Id_asignacion+'" value="'+data+'"> <a class="client-link destino_'+Id_asignacion+'">'+Destino+'</a> <input type="hidden" id="destino_contrato_'+Id_asignacion+'" value="'+Destino+'"> ';
        }else if(estado == "Cargar"){
          return '<a style="display: block" onclick="'+funcion_cargar_modal+'" class="client-link origen_'+Id_asignacion+'" >'+data+'</a> <a onclick="'+funcion_cargar_modal+'" class="client-link destino_'+Id_asignacion+'" >'+Destino+'</a>';
        }else if(estado == "Despachar"){
          return '<a style="display: block" class="client-link origen_'+Id_asignacion+'" >'+data+'</a> <a class="client-link destino_'+Id_asignacion+'" >'+Destino+'</a>';
        }else if(estado == "Num viaje"){
          return '<a style="display: block" class="client-link origen_'+Id_asignacion+'" >'+data+'</a> <a class="client-link destino_'+Id_asignacion+'" >'+Destino+'</a>';
        }else if(estado == "Seguimiento"){
          return '<a style="display: block" class="client-link origen_'+Id_asignacion+'" >'+data+'</a> <a class="client-link destino_'+Id_asignacion+'" >'+Destino+'</a>';
        }else{
          return data;
        }
      }
    },
    {
      "targets": 1,
      "data": "Tipo_vehiculo",
      "render": function ( data, type, full, meta ) {
        if(estado == "Asignar"){
          return '<a class="client-link tipo_vehiculo_'+Id_asignacion+'" id="tipo_vehiculos_trayler'+Id_asignacion+'" value="'+data+'" >'+data+'</a><input type="hidden" id="tipo_vehiculo_contrato_'+Id_asignacion+'" value="'+data+'">';
        }else if(estado == "Cargar"){
          return '<a class="client-link tipo_vehiculo_'+Id_asignacion+'" onclick="'+funcion_cargar_modal+'">'+data+'</a>';
        }else if(estado == "Despachar"){
          return '<a class="client-link tipo_vehiculo_'+Id_asignacion+'">'+data+'</a>';
        }else if(estado == "Num viaje"){
          return '<a class="client-link tipo_vehiculo_'+Id_asignacion+'">'+data+'</a>';
        }else{
          return data;
        }
      }
    },
     {
      "targets": 2,
      "data": "Tipo_operacion",
      "render": function ( data, type, full, meta ) {
        if(estado == "Asignar"){
          return '<input type="hidden" id="tipo_operacion_contrato_'+Id_asignacion+'" value="'+Tipo_operacion+'"><a class="client-link tipo_operacion_'+Id_asignacion+'" >'+data+'</a><input type="hidden" class="cedi'+Id_asignacion+'" value="'+cedi+'">';
        }else if(estado == "Cargar"){
          return '<a onclick="'+funcion_cargar_modal+'" class="client-link tipo_operacion_'+Id_asignacion+'" >'+data+'</a><input type="hidden" class="cedi'+Id_asignacion+'" value="'+cedi+'">';
        }else if(estado == "Despachar"){
          return '<a  class="client-link tipo_operacion_'+Id_asignacion+'" >'+data+'</a><input type="hidden" class="cedi'+Id_asignacion+'" value="'+cedi+'">';
        }else if(estado == "Num viaje"){
          return '<a  class="client-link tipo_operacion_'+Id_asignacion+'" >'+data+'</a><input type="hidden" class="cedi'+Id_asignacion+'" value="'+cedi+'">';
        }else{
          return data;
        }
      }
    },
    
    {
      "targets": 3,
      "data": "Fecha_cita",
      "render": function ( data, type, full, meta ) {
        if(estado == "Asignar"){
          return '<a class="client-link fecha_cita_'+Id_asignacion+'">'+data+'</a>';
        }else if(estado == "Cargar"){
          return '<a onclick="'+funcion_cargar_modal+'" class="client-link fecha_cita_'+Id_asignacion+'" >'+data+'</a>';
        }else if(estado == "Despachar"){
          return '<a class="client-link fecha_cita_'+Id_asignacion+'" >'+data+'</a>';
        }else if(estado == "Num viaje"){
          return '<a class="client-link fecha_cita_'+Id_asignacion+'" >'+data+'</a>';
        }else{
          return data;
        }
      }
    },
   {
      "targets": 4,
      "data": "Hora_inicio",
      "render": function ( data, type, full, meta ) {
        if(estado == "Asignar"){
          return '<a style="display: block" class="client-link hora_inicio_'+Id_asignacion+'">'+data+'</a> <a class="client-link hora_fin_'+Id_asignacion+'">'+Hora_fin+'</a>';
        }else if(estado == "Cargar"){
          return '<a style="display: block" onclick="'+funcion_cargar_modal+'" class="client-link hora_inicio_'+Id_asignacion+'"  >'+data+'</a> <a onclick="'+funcion_cargar_modal+'" class="client-link hora_fin_'+Id_asignacion+'"  >'+Hora_fin+'</a>';
        }else if(estado == "Despachar"){
          return '<a style="display: block" class="client-link hora_inicio_'+Id_asignacion+'"  >'+data+'</a> <a class="client-link hora_fin_'+Id_asignacion+'"  >'+Hora_fin+'</a>';
        }else if(estado == "Num viaje"){
          return '<a style="display: block" class="client-link hora_inicio_'+Id_asignacion+'"  >'+data+'</a> <a class="client-link hora_fin_'+Id_asignacion+'"  >'+Hora_fin+'</a>';
        }else{
          return data;
        }
      }
    },
    {
      "targets": 5,
      "data": "Tarifa",
      "render": function ( data, type, full, meta ) {
        funcion = "buscar_contrato_asignado('"+Id_asignacion+"');";
        if(estado == "Asignar"){
           return '<a style="display: block" class="client-link hora_inicio_'+Id_asignacion+'">'+data+'</a>';
        }else if(estado == "Cargar"){
          return '<a onclick="'+funcion_cargar_modal+'" class="client-link no_contrato_'+Id_asignacion+'">'+data+'</a>'
        }else if(estado == "Despachar"){
          return '<a class="client-link no_contrato_'+Id_asignacion+'">'+data+'</a>';
        }else if(estado == "Num viaje"){
          return '<a class="client-link no_contrato_'+Id_asignacion+'">'+data+'</a>';
        }else{
          return data;
        }
      }
    },
    {
      "targets": 6,
      "data": "No_contrato",
      "render": function ( data, type, full, meta ) {
        funcion = "buscar_contrato_asignado('"+Id_asignacion+"');";
        if(estado == "Asignar"){
           return '<a style="display: block" class="client-link hora_inicio_'+Id_asignacion+'">'+data+'</a>';
        }else if(estado == "Cargar"){
          return '<a onclick="'+funcion_cargar_modal+'" class="client-link no_contrato_'+Id_asignacion+'">'+data+'</a>'
        }else if(estado == "Despachar"){
          return '<a class="client-link no_contrato_'+Id_asignacion+'">'+data+'</a>';
        }else if(estado == "Num viaje"){
          return '<a class="client-link no_contrato_'+Id_asignacion+'">'+data+'</a>';
        }else{
          return data;
        }
      }
    },
    {
      "targets": 7,
      "data": "Id_asignacion",
      "render": function ( data, type, full, meta ) {
        funcion = "myFunction('"+data+"');"
        if(estado == "Asignar"){
          return '<input id="placa_verificado_'+Id_asignacion+'" type="hidden" value=""><div class="dropdown"><input data-toggle="dropdown" type="text" id="placa_vehiculo_asignado_'+Id_asignacion+'"  data-toggle="tooltip" data-placement="top" class="tooltip-demo form-control busqueda_vehiculo_viaje_'+data+'" onkeyup="'+funcion+'" style="width:100%; border: none;"><ul class="dropdown-menu scrollable-menu" id="agregar_vehiculo_viaje_'+data+'" style="height: auto; max-height: 200px; overflow-x: hidden; text-decoration: none;" ></ul></div> <input value="'+data+'" type="hidden">';
        }else if(estado == "Cargar"){
          return '<a onclick="'+funcion_cargar_modal+'" class="client-link placa_'+Id_asignacion+'">'+Placa+'</a>';
        }else if(estado == "Despachar"){
          return '<a class="client-link placa_'+Id_asignacion+'">'+Placa+'</a>';
        }else if(estado == "Num viaje"){
          return '<a class="client-link placa_'+Id_asignacion+'">'+Placa+'</a>';
        }else{
          return data;
        }
      }
    },
    {
      //placa trayler
      "targets": 8,
      "data": "Id_asignacion",
      "render": function ( data, type, full, meta ) {
       
        Id_asignacion = full.Id_asignacion;
        Tipo_vehiculo = full.Tipo_vehiculo;
        Tipo_operacion = full.Tipo_operacion;
        Placa_trayler = full.Placa_trayler;
        estado = full.Estado;
        funcion_trayler = "buscar_placa_trayler( "+data+",'"+Tipo_vehiculo+"','"+Tipo_operacion+"' );";
        funcion_cargar_modal = "cargar_infocarga_viaje('"+Id_asignacion+"');"
        if(estado == "Asignar"){
          if(Tipo_vehiculo =="Mula" || Tipo_vehiculo =="Minimula" )
        {
          disabled="";
        }
        else
        {
          disabled="disabled";
        }
          return '<input  id="placa_trayler_verificado_'+Id_asignacion+'" type="hidden" value=""><div class="dropdown"><input '+disabled+' data-toggle="dropdown" type="text" id="placa_trayler_vehiculo_asignado_'+Id_asignacion+'"  class="form-control busqueda_vehiculo_trayler_viaje_'+data+'" onkeyup="'+funcion_trayler+'" style="width:100%; border: none;" ><ul class="dropdown-menu scrollable-menu" id="agregar_vehiculo_trailer_viaje_'+data+'" style="height: auto; max-height: 200px; overflow-x: hidden; text-decoration: none; "></ul></div> <input value="'+data+'" type="hidden">';
        }else if(estado == "Cargar"){
          return '<a onclick="'+funcion_cargar_modal+'" class="client-link placa_'+Id_asignacion+'">'+Placa_trayler+'</a>';
        }else if(estado == "Despachar"){
          return '<a class="client-link placa_'+Id_asignacion+'">'+Placa_trayler+'</a>';
        }else if(estado == "Num viaje"){
          return '<a class="client-link placa_'+Id_asignacion+'">'+Placa_trayler+'</a>';
        }else{
          return data;
        }


      }
    },
    {
      "targets": 9,
      "data": "Conductor",
      "render": function ( data, type, full, meta ) {
        if(estado == "Asignar"){
          return '<input id="conductor_verificado_'+Id_asignacion+'" type="hidden" value=""><div class="dropdown"><input data-toggle="dropdown" type="text" id="conductor_asignado_'+Id_asignacion+'" class="form-control busqueda_conductor_viaje_'+Id_asignacion+'" onkeyup="'+funcion_conductor+'" style="width: 100%;  border: none;"><ul class="dropdown-menu scrollable-menu" id="agregar_conductor_viaje_'+Id_asignacion+'" style="height: auto; max-height: 200px; overflow-x: hidden; text-decoration: none;"></ul></div> <input value="'+data+'" type="hidden">';
        }else if(estado == "Cargar"){
          return '<a onclick="'+funcion_cargar_modal+'" class="client-link conductor_'+Id_asignacion+'">'+data+'</a>';
        }else if(estado == "Despachar"){
          return '<a class="client-link conductor_'+Id_asignacion+'" >'+data+'</a>';
        }else if(estado == "Num viaje"){
          return '<a class="client-link conductor_'+Id_asignacion+'" >'+data+'</a>';
        }else{
          return data;
        }
      }
    },
    {
      "targets": 10,
      "data": "Destinatario",
      "render": function ( data, type, full, meta ) {
        if(estado == "Asignar"){
          if(data == ''){
            return '<input id="destinatario_verificado_'+Id_asignacion+'" type="hidden"><div class="dropdown"><input data-toggle="dropdown" type="text" id="conductor_destinatario_'+Id_asignacion+'" class="form-control busqueda_destinatario_viaje_'+Id_asignacion+'" onkeyup="'+funcion_destinatario+'" style="width: 100%;  border: none;"><ul class="dropdown-menu scrollable-menu lista_vacia" id="agregar_destinatario_viaje_'+Id_asignacion+'" style="height: auto; max-height: 200px; overflow-x: hidden; text-decoration: none;"></ul></div> <input value="'+data+'" type="hidden">';
          }else{
            return '<a class="client-link conductor_'+Id_asignacion+'" >'+data+'</a>';;
          }
        }else if(estado == "Cargar"){
          return '<a onclick="'+funcion_cargar_modal+'" class="client-link conductor_'+Id_asignacion+'">'+data+'</a>';
        }else if(estado == "Despachar"){
          return '<a class="client-link conductor_'+Id_asignacion+'" >'+data+'</a>';
        }else if(estado == "Num viaje"){
          return '<a class="client-link conductor_'+Id_asignacion+'" >'+data+'</a>';
        }else{
          return data;
        }
      }
    },
    
    {
      "targets": 11,
      "data": "Estado",
      "render": function ( data, type, full, meta ) {
        if(estado == "Asignar"){
          return '<a class="client-link estado_'+Id_asignacion+'" >'+data+'</a>';
        }else if(estado == "Cargar"){
          return '<a onclick="'+funcion_cargar_modal+'" class="client-link estado_'+Id_asignacion+'">'+data+'</a>';
        }else if(estado == "Despachar"){
          return '<a class="client-link estado_'+Id_asignacion+'">'+data+'</a>';
        }else if(estado == "Num viaje"){
          return '<a class="client-link estado_'+Id_asignacion+'">'+data+'</a>';
        }else{
          return '<a class="client-link estado_'+Id_asignacion+'">'+data+'</a>';
        }
      }
    },
    {
      "targets": 12,
      "data": "Id_asignacion",
      "render": function ( data, type, full, meta ) {
        Id_asignacion = full.Id_asignacion;
        Tipo_vehiculo = full.Tipo_vehiculo;
        Hora_inicio = full.Hora_inicio;
        Hora_fin = full.Hora_fin;
        Fecha_cita = full.Fecha_cita;
        Origen = full.Origen;
        Destino = full.Destino;
        Tipo_operacion = full.Tipo_operacion;
        Placa = full.Placa;
        Placa_trayler = full.Placa_trayler;
        No_documento_conductor= full.No_documento_conductor;
        No_contrato = full.No_contrato;
        idVehiculo_consecutivo = data.trim();
        estado = full.Estado;
        vehiculoAsignado = "enviarVehiculoAgsinado('"+idVehiculo_consecutivo+"');"
        id_data_peticion = "obtener_viaje_infocarga_data('"+data+"');"
        verificar_campos = "verificar_campos('"+idVehiculo_consecutivo+"')";
        boton_asignar = "boton_asignar"+Id_asignacion;
        vehiculo_despachado = "vehiculo_despachado_viaje('"+idVehiculo_consecutivo+"')";
        cambio_estado = "vehiculo_cambio_estado_num_viaje('"+idVehiculo_consecutivo+"')";
        cambiar_estado_ultimo = "";//"cambiar_estado_facturas('"+idVehiculo_consecutivo+"')";
        // '+direccion_url_asignar+'; 
        Id_asignacion = full.Id_asignacion;
        if(estado == "Asignar"){
          direccion_url_asignar = "window.open('pdf?id="+data+"&estado=Asignar','window.print()'); ";
          return '<a id="'+boton_asignar+'" name="boton_asignar" class="btn btn-info animacion_boton_'+Id_asignacion+'" type="button" onclick="'+vehiculoAsignado+'"  style="display: block; margin: 5px; border-radius: 15px; padding:3px;" disabled><i class="fa fa-sign-in" style="font-size: 13px"></i>'+"   "+'<i class="fa fa-truck" style="font-size: 13px"></i></a>';//
        }else if(estado == "Cargar"){
          return '<a class="btn btn-info" type="button" style="display: block; margin: 5px; border-radius: 15px; padding:3px;" disabled><i class="fa fa-arrow-right" style="font-size: 13px"><i/></a>';
        }else if(estado == "Despachar"){
          direccion_url_despachar = "window.open('pdf?id="+data+"&estado=nn','window.print()'); ";
          return '<a class="btn btn-info" onclick="'+cambio_estado+';'+direccion_url_despachar+';" type="button" style="display: block; margin: 5px; border-radius: 15px; padding:3px;"><i class="fa fa-truck" style="font-size: 13px"></i>'+"   "+'<i class="fa fa-sign-out" style="font-size: 13px"></i><a href="pdf?id='+data+'"  ;"></a>';
        }else if(estado == "Num viaje"){
          return '<a class="btn btn-info"  onclick="'+vehiculo_despachado+';" type="button" style="display: block; margin: 5px; border-radius: 15px; padding:3px;"><i class="fa fa-slack" style="font-size: 13px"></i><a href="pdf?id='+data+'"  ;"></a><span id="cambio_estado_regreso"></span><span style="visibility:hidden" id="respuesta_num_viaje"></span>';
        }else{
          return data;
        }
      }
    }
    ],"fnDrawCallback": function (oSettings) {
      //aqui se realizara procesos cuando cargue todos los datos de la tabla
    }
  });

  },
  render: function() {
    return (
      <div className="no-scroll">
        <div className="clients-list">
          <ul className="nav nav-tabs">
            <ul className="nav nav-tabs">
              <li className="active">
                <a href="#tab-1">
                  <i className="fa fa-briefcase"></i> 
                  Proceso vehicular
                </a>
              </li>
            </ul>
          </ul>
      
      <div className="tab-content">
      
        <div id="tab-1" className="tab-pane active">
        <div className="form-group">
        <label>Filtrar por:</label>
        <select className="form-control m-b">
          <option value="">--Selecione--</option>
          <option value="Asignar">Asignar</option>
          <option value="Cargar">Cargar</option>
          <option value="Despachar">Despachar</option>
          <option value="">Ninguno</option>
        </select>
      </div>
      <table className="table table-striped table-bordered table-hover"  id="editable">
                <thead>
                  <tr>
                    <th><span>Origen</span><span>Destino</span></th>
                    <th>Tipo vehiculo</th>
                    <th>Tipo operacion</th>
                    <th>Fecha cita</th>
                    <th><span>Hora inicio</span><span>Hora fin</span></th>
                    <th>Tarifa</th>
                    <th>Contrato</th>
                    <th>Placa</th>
                    <th>P. Trayler</th>
                    <th>Conductor</th>
                    <th>Destinatario</th> 
                    <th>Estado</th>
                    <th>Asignacion</th>
                  </tr>
                </thead>
                <tbody>  
                </tbody>
                <tfoot>
                </tfoot>
              </table>
              </div>
      </div>
    </div>
  </div>
    );
  }
});
/******************************COMPONENTE TABLA*******************************************************/
//FUNCION PARA CARGAR MODAL Y ENVIAR DATOS 
var cargar_infocarga_viaje = function(id_solicitud_vehicular){
  var id_solicitud_vehicular = id_solicitud_vehicular;
  $.ajax({
    type: 'POST',
    url: 'querys/consultar/consultar_solicitud_vehicular_by_id_en_cargue2.php',
    data: 'id_solicitud_vehicular=' + id_solicitud_vehicular,
    success: function(respuesta) {
      var id_SolicitudVehicular= JSON.parse(respuesta);
      $("#container").html("");
      ReactDOM.render(React.createElement(ModalContent, { idsolicitudVehicular: id_SolicitudVehicular }), document.getElementById('container'));
    }
  });
}
// FUNCION PARA CARGAR TABLA DEL CEDI SELECIONADO


function destinatarioClicked(idDestinatario, idPeticion){
  $("#conductor_destinatario_"+idPeticion).val($("#destinatario_lista_"+idDestinatario).text());
  $("#destinatario_verificado_"+idPeticion).val(idDestinatario);
}
function buscar_destinatario(idPeticion){
  $(".lista_vacia").html('');
  var idPeticion = idPeticion;
  $.ajax({
    type: 'POST',
    url: 'querys/consultar/consultar_solicitud_vehicular_by_id_en_cargue2.php',
    data: 'id_solicitud_vehicular=' + idPeticion,
    success: function(respuesta) {
      var id_SolicitudVehicular= JSON.parse(respuesta);
      id_SolicitudVehicular.idDestinatarioInfoCarga.map(function(destinatario, i){
        console.log(i)
        $(`#agregar_destinatario_viaje_${idPeticion}`).append(`<li><a id="destinatario_lista_${destinatario.Id_empresa}" onclick="destinatarioClicked(${destinatario.Id_empresa}, ${idPeticion})">${destinatario.Codigo_empresa} - ${destinatario.Razon_social}</a><li>`);
      });
    }
  });
}

//FUNCTION DEL BOTON PARA INSERTAR CONTRATO, CONDUCTOR, PLACA EN LA DB 
function enviarVehiculoAgsinado(idSolicitudVehiculo){
  var idSolicitudVehiculo = idSolicitudVehiculo
  $(".animacion_boton_"+idSolicitudVehiculo+"").html('<div class="load-3"><div class="line"></div><div class="line"></div><div class="line"></div></div>');
  validacionDeCampos(idSolicitudVehiculo, function(validacion){
    if(validacion == 2){
      var placa_vehiculo_asignado = $("#placa_vehiculo_asignado_"+idSolicitudVehiculo+"").val();
      var placa_verificado = $("#placa_verificado_"+idSolicitudVehiculo+"").val();
      var placa_trayler_vehiculo_asignado = $("#placa_trayler_vehiculo_asignado_"+idSolicitudVehiculo+"").val();
      var placa_trayler_verificado = $("#placa_trayler_verificado_"+idSolicitudVehiculo+"").val();
      var conductor_asignado = $("#conductor_asignado_"+idSolicitudVehiculo+"").val();
      var conductor_verificado = $("#conductor_verificado_"+idSolicitudVehiculo+"").val();
      var idDestinatarioViaje = $("#destinatario_verificado_"+idSolicitudVehiculo).val();

      placa_vehiculo_asignado = placa_vehiculo_asignado.split("-");
      placa_vehiculo_asignado = placa_vehiculo_asignado[0].trim();

      placa_trayler_vehiculo_asignado = placa_trayler_vehiculo_asignado.split("-");
      placa_trayler_vehiculo_asignado = placa_trayler_vehiculo_asignado[0].trim();

      conductor_asignado = conductor_asignado.split("-");
      numero_documento_conductor_asignado = conductor_asignado[0].trim();
      conductor_asignado = conductor_asignado[1].trim();
       

      var cedi = $(".cedi"+idSolicitudVehiculo+"").val();
      var estado = "Cargar";
      
      var nuevo_dato =  {
                          placa_vehiculo_asignado:placa_vehiculo_asignado, 
                          placa_trayler_vehiculo_asignado:placa_trayler_vehiculo_asignado, 
                          numero_documento_conductor_asignado:numero_documento_conductor_asignado, 
                          conductor_asignado:conductor_asignado,
                          estado:estado, 
                          idSolicitudVehiculo:idSolicitudVehiculo,
                          idDestinatarioViaje:idDestinatarioViaje,
                          "vehiculoSolicitudVehiculos":
                            {id: idSolicitudVehiculo}
                        };
      jQuery.post('querys/crear/query_vehiculo_agsinado_Json.php', {
        nuevo_dato: nuevo_dato
      }, function(response){
        $(".animacion_boton_"+idSolicitudVehiculo+"").html('<i class="fa fa-check" style="font-size: 13px"></i>');
        cedi_clicked(cedi);
        var windowOrdenDeCarga = window.open(`pdf?id=${idSolicitudVehiculo}&estado=Asignar`);
        windowOrdenDeCarga.print()
      })
    }else{
      $(".animacion_boton_"+idSolicitudVehiculo+"").html('<i class="fa fa-times" style="font-size: 13px"></i>');
      setTimeout(function(){
        $(".animacion_boton_"+idSolicitudVehiculo+"").html('<i class="fa fa-truck" style="font-size: 13px"></i>');
      }, 2000)
    }
  });//end validacionDeCampos
}
// FUNCION DE VALIDACION DE CAMPOS PLACA , CONDUCTOR , CONTRATO SI ESTAN VALIDO O NO ESTA REGISTRADOS EN DB
function validacionDeCampos(idSolicitudVehiculo,callback){
  //var placa_vehiculo_asignado = $("#placa_vehiculo_asignado_"+idSolicitudVehiculo+"").val();
  //var placa_verificado = $("#placa_verificado_"+idSolicitudVehiculo+"").val();
  //var conductor_asignado = $("#conductor_asignado_"+idSolicitudVehiculo+"").val();
  //var conductor_verificado = $("#conductor_verificado_"+idSolicitudVehiculo+"").val();

  var campo_vehiculo_asignado, campo_conductor_asignado, campo_contrato_asignado;
  if($("#placa_vehiculo_asignado_"+idSolicitudVehiculo+"").val() == "" || $("#placa_vehiculo_asignado_"+idSolicitudVehiculo+"").val() ==  null){
    $("#placa_vehiculo_asignado_"+idSolicitudVehiculo+"").css("background", "#D43949");
    campo_vehiculo_asignado =0;
    $("#boton_asignar"+id_campo).attr("disabled",true);
  }else if($("#placa_verificado_"+idSolicitudVehiculo+"").val() == "" || $("#placa_verificado_"+idSolicitudVehiculo+"").val() == null){
    $("#placa_vehiculo_asignado_"+idSolicitudVehiculo+"").css("background", "#1ab394");
    campo_vehiculo_asignado =0;
    $("#boton_asignar"+id_campo).attr("disabled",true);
  }else if($("#placa_verificado_"+idSolicitudVehiculo+"").val() != $("#placa_vehiculo_asignado_"+idSolicitudVehiculo+"").val()){
    $("#placa_vehiculo_asignado_"+idSolicitudVehiculo+"").css("background", "peru");
    campo_vehiculo_asignado =0;
    $("#boton_asignar"+id_campo).attr("disabled",true);
  }else{
    campo_vehiculo_asignado =1;
  }
  //validacion conductor
  if($("#conductor_asignado_"+idSolicitudVehiculo+"").val() == "" || $("#conductor_asignado_"+idSolicitudVehiculo+"").val() ==  null){
    $("#conductor_asignado_"+idSolicitudVehiculo+"").css("background", "#D43949");
    campo_conductor_asignado =0;
    $("#boton_asignar"+id_campo).attr("disabled",true);
  }else if($("#conductor_verificado_"+idSolicitudVehiculo+"").val() == "" || $("#conductor_verificado_"+idSolicitudVehiculo+"").val() == null){
    $("#conductor_asignado_"+idSolicitudVehiculo+"").css("background", "#1ab394");
    campo_conductor_asignado =0;
    $("#boton_asignar"+id_campo).attr("disabled",true);
  }else if($("#conductor_verificado_"+idSolicitudVehiculo+"").val() != $("#conductor_asignado_"+idSolicitudVehiculo+"").val()){
    $("#conductor_asignado_"+idSolicitudVehiculo+"").css("background", "peru");
    campo_conductor_asignado =0;
    $("#boton_asignar"+id_campo).attr("disabled",true);
  }else{
    campo_conductor_asignado =1;
  }
  var validacion = campo_vehiculo_asignado + campo_conductor_asignado ;
  callback(validacion);
}


//CONSULTAR  PLACA DEL VEHICULO DEL VIAJE
function myFunction(valor){
  var timeOut = null
  var valor = valor;
  consecutivo_solicitud = valor
  var texto = $(".busqueda_vehiculo_viaje_"+valor).val();
  $(".busqueda_vehiculo_viaje_"+valor).css("background", "white");
  if(texto == ""){
  //var $consultar_propietario_loading3 = $('#consultar_propietario_loading3').html(''); 
  }else{
    var parametros_busqueda_placa = { "texto": texto, "valor": valor,};
    clearTimeout(timeOut)
    timeOut = setTimeout(function() {
      $.ajax({
        type: 'POST',
        url: 'querys/consultar/consultar_vehiculo_viaje.php',
        data: parametros_busqueda_placa,
        success: function(respuesta) {
          $("#agregar_vehiculo_viaje_"+valor).html(respuesta);
        }
      });
    }, 300)
  }
}
//CONSULTAR  PLACA TRAYER DEL VEHICULO DEL VIAJE
function buscar_placa_trayler(valor,tv,to){
 //alert("entro1")
  var timeOut = null
  var valor = valor;
  consecutivo_solicitud = valor
  var texto = $(".busqueda_vehiculo_trayler_viaje_"+valor).val();
   //alert(texto)
  $(".busqueda_vehiculo_trayler_viaje_"+valor).css("background", "white");
 
  //   alert("entro2")
    if(texto == ""){
    //var $consultar_propietario_loading3 = $('#consultar_propietario_loading3').html(''); 
    }
    else
    {
    //  alert("entro a buscar")
      var parametros_busqueda_placa_trailer = { "texto": texto, "valor": valor,};
      clearTimeout(timeOut)
      timeOut = setTimeout(function() {
        $.ajax({
          type: 'POST',
          url: 'querys/consultar/consultar_vehiculo_trayler_viaje.php',
          data: parametros_busqueda_placa_trailer,
          success: function(respuesta) {
            $("#agregar_vehiculo_trailer_viaje_"+valor).html(respuesta);
          }
        });
      }, 300)
    }
}

//CONSULTAR EL CONDUCTOR ASGNADO EN EL CAMPO DE CONDUCTOR
function buscar_conductor_asignado(valor){
  var timeOut = null
  var valor = valor;
  consecutivo_solicitud = valor
  var texto = $(".busqueda_conductor_viaje_"+valor).val();
  $(".busqueda_conductor_viaje_"+valor).css("background", "white");
  if(texto == ""){

  }else{
    var parametros_busqueda_conductor = { "texto": texto, "valor": valor,};
  //  console.log(texto)
   // console.log(valor)
    clearTimeout(timeOut)
    timeOut = setTimeout(function() {
      $.ajax({
        type: 'POST',
        url: 'querys/consultar/consultar_conductor_viaje.php',
        data: parametros_busqueda_conductor,
        success: function(respuesta) {
          $("#agregar_conductor_viaje_"+valor).html(respuesta);
        }
      });
    }, 300)
  }
}
//CONSULTAR EL CONTRATO ASGNADO EN EL CAMPO DE CONTRATO
function buscar_contrato_asignado(valor){
  var timeOut = null
  var valor = valor;
  consecutivo_solicitud = valor
  var texto = $(".busqueda_contrato_viaje_"+valor).val();
  var destino_contrato = $("#destino_contrato_"+valor).val();
  var origen_contrato = $("#origen_contrato_"+valor).val();
  var tipo_vehiculo_contrato = $("#tipo_vehiculo_contrato_"+valor).val();
  var tipo_operacion_contrato = $("#tipo_operacion_contrato_"+valor).val();
  $(".busqueda_contrato_viaje_"+valor).css("background", "white");
  if(texto == ""){

  }else{
    var parametros_busqueda_contrato = { 
      "texto": texto,
      "valor": valor,
      "destino_contrato": destino_contrato,
      "origen_contrato": origen_contrato,
      "tipo_vehiculo_contrato": tipo_vehiculo_contrato,
      "tipo_operacion_contrato": tipo_operacion_contrato
    };
    clearTimeout(timeOut)
    timeOut = setTimeout(function() {
      $.ajax({
        type: 'POST',
        url: 'querys/consultar/consultar_persona_empresa_infocarga.php',
        data: parametros_busqueda_contrato,
        success: function(respuesta) {
          $("#agregar_contrato_viaje_"+valor).html(respuesta);
        }
      });
    }, 300)
  }
}
//FUNCION SELECIONAR VEHICULO CUANDO ES MOSTRADO EN LA LISTA, HTML TRAIDO POR PHP
function vehiculo_viaje_clicked(idVehiculo,id_campo,placa){
  //alert(placa)
  var idVehiculo = idVehiculo;
  var parametros_documentos_vehiculo ={
    "id_campo": id_campo,
    "placa": placa      
    }
    $.ajax({
        type: 'POST',
        url: 'querys/consultar/verificar_documentos_vehiculo.php',
        data: parametros_documentos_vehiculo,
        dataType: 'json',
        success: function(respuesta_vehiculo) {
          respuesta = respuesta_vehiculo.variable ;
          msj = respuesta_vehiculo.msj ;
         // console.log(respuesta_vehiculo.variable)
          if(respuesta==1)
          {
            swal('Error',msj, 'error');
            // id_conductor = $("#conductor_asignado_"+idConductor).val('');
             $("#placa_vehiculo_asignado_"+id_campo).val('');
             $("#placa_verificado_"+id_campo).val('');
          }
          else if(respuesta==2)
          {
            swal('Error',msj, 'error');
            // id_conductor = $("#conductor_asignado_"+idConductor).val('');
             $("#placa_vehiculo_asignado_"+id_campo).val('');
             $("#placa_verificado_"+id_campo).val('');
          }
          else
          {
            var id_vehiculo = $("#vehiculo_viaje_selected_"+idVehiculo).text();
            $("#placa_vehiculo_asignado_"+id_campo).val(id_vehiculo);
            $("#placa_verificado_"+id_campo).val(id_vehiculo);

              conductor = $("#conductor_asignado_"+id_campo).val();
              if(document.getElementById(`placa_trayler_vehiculo_asignado_${id_campo}`).disabled === true)
              {
                 if(conductor!="")
                {
                  $("#boton_asignar"+id_campo).attr("disabled",false);
                }
              }
              else
              {
                placa_tra = $("#placa_trayler_vehiculo_asignado_"+id_campo).val();
                if(conductor!="" || placa_tra!="")
                {
                  $("#boton_asignar"+id_campo).attr("disabled",false);
                }
              }
          }
         
        }
      }); 
}

function vehiculo_trayler_viaje_clicked(idVehiculo,id_campo,placa){
  var idVehiculo = idVehiculo;
    var parametros_documentos_vehiculo ={
    "id_campo": id_campo,
    "placa": placa      
    }
    $.ajax({
        type: 'POST',
        url: 'querys/consultar/verificar_documentos_vehiculo_trayler.php',
        data: parametros_documentos_vehiculo,
        dataType: 'json',
        success: function(respuesta_vehiculo_trayler) {
          respuesta = respuesta_vehiculo_trayler.variable ;
          msj = respuesta_vehiculo_trayler.msj ;
          if(respuesta==1)
          {
            swal('Error',msj, 'error');
            // id_conductor = $("#conductor_asignado_"+idConductor).val('');
             $("#placa_trayler_vehiculo_asignado_"+id_campo).val('');
             $("#placa_trayler_verificado_"+id_campo).val('');
          }
          else if(respuesta==2)
          {
            swal('Error',msj, 'error');
            // id_conductor = $("#conductor_asignado_"+idConductor).val('');
             $("#placa_trayler_vehiculo_asignado_"+id_campo).val('');
             $("#placa_trayler_verificado_"+id_campo).val('');
          }
          else
          {
            var id_vehiculo = $("#vehiculo_trayler_viaje_selected_"+idVehiculo).text();
            $("#placa_trayler_vehiculo_asignado_"+id_campo).val(id_vehiculo);
            $("#placa_trayler_verificado_"+id_campo).val(id_vehiculo);

              conductor = $("#conductor_asignado_"+id_campo).val();
              placa = $("#placa_vehiculo_asignado_"+id_campo).val();
             
              if(conductor!="" || placa!="")
              {
                $("#boton_asignar"+id_campo).attr("disabled",false);
              }
             
          }
         
        }
      });
}
//FUNCION SELECIONAR VEHICULO CUANDO ES MOSTRADO EN LA LISTA, HTML TRAIDO POR PHP
function conductor_viaje_clicked(idConductor,id_campo,no_documento_conductor){

    var idConductor = idConductor;
    var parametros_documentos ={
    "id_campo": id_campo,
    "no_documento_conductor": no_documento_conductor      
    }
    $.ajax({
        type: 'POST',
        url: 'querys/consultar/verificar_documentos_conductor.php',
        data: parametros_documentos,
        dataType: 'json',
        success: function(respuesta_conductor) {
          respuesta = respuesta_conductor.variable ;
          msj = respuesta_conductor.msj ;
          if(respuesta==1)
          {
            swal('Error',msj, 'error');
            // id_conductor = $("#conductor_asignado_"+idConductor).val('');
             $("#placa_trayler_vehiculo_asignado_"+id_campo).val('');
             $("#placa_trayler_verificado_"+id_campo).val('');
          }
          else if(respuesta==2)
          {
            swal('Error',msj, 'error');
            // id_conductor = $("#conductor_asignado_"+idConductor).val('');
             $("#placa_trayler_vehiculo_asignado_"+id_campo).val('');
             $("#placa_trayler_verificado_"+id_campo).val('');
          }
          else
          {
            id_conductor = $("#conductor_viaje_selected_"+idConductor).text(); 
          $("#conductor_asignado_"+id_campo).val(id_conductor);
          $("#conductor_verificado_"+id_campo).val(id_conductor);
             placa = $("#placa_vehiculo_asignado_"+id_campo).val();
              if(document.getElementById(`placa_trayler_vehiculo_asignado_${id_campo}`).disabled === true)
              {
                 if(placa!="")
                {
                  $("#boton_asignar"+id_campo).attr("disabled",false);
                }
              }
              else
              {
                placa_tra = $("#placa_trayler_vehiculo_asignado_"+id_campo).val();
                if(placa!="" || placa_tra!="")
                {
                  $("#boton_asignar"+id_campo).attr("disabled",false);
                }
              }
            //}
          }
          // var id_conductor = $("#conductor_viaje_selected_"+idConductor).text();
        }
      });
}
//FUNCION SELECIONAR VEHICULO CUANDO ES MOSTRADO EN LA LISTA, HTML TRAIDO POR PHP
function contrato_selecionado_clicked(idContrato,id_campo){
  var idContrato = idContrato;
  var id_contrato = $("#no_contrato_infocarga_"+idContrato).text();
  $("#contrato_asignado_"+id_campo).val(id_contrato);
  $("#contrato_verificado_"+id_campo).val(id_contrato);
}


function vehiculo_cambio_estado_num_viaje(idSolicitudVehiculo){
  id=idSolicitudVehiculo;
  $.ajax({
    type: 'POST',
    url: 'querys/consultar/cambio_de_estado.php',
    data: 'id_solicitud_vehicular=' + idSolicitudVehiculo,
    success: function(respuesta) {
      console.log(respuesta)
      $("#cambio_estado_regreso").html(respuesta);
    }
  });  
}

function cambiar_estado_facturas(idSolicitudVehiculo){
  id=idSolicitudVehiculo;
  $.ajax({
    type: 'POST',
    url: 'querys/consultar/cambio_de_estado_facturas.php',
    data: 'id_solicitud_vehicular=' + idSolicitudVehiculo,
    success: function(respuesta) {
      console.log(respuesta)
      $("#cambio_estado_regreso").html(respuesta);
    }
  });  
}

function vehiculo_despachado_viaje(idSolicitudVehiculo){
  id=idSolicitudVehiculo;
  $.ajax({
    type: 'POST',
    url: 'querys/consultar/despacho_listo_camion_por_regresar.php',
    data: 'id_solicitud_vehicular=' + idSolicitudVehiculo,
    success: function(respuesta) {
     // console.log(respuesta)
      $("#cambio_estado_regreso").html(respuesta);
      $('#modal_cargue_numero_viaje').modal({
          show: true
      });

    }
  });  
}






function boton_guardar_numero_viaje(){
  swal({
    title: "¿Esta seguro de guardar el numero del viaje?",
    text: "Numero viaje",
    type: "info",
    showCancelButton: true,
    confirmButtonColor: '#1ab394',
    confirmButtonText: 'Si',
    cancelButtonText: "No",
    showLoaderOnConfirm: true,
    closeOnConfirm: false,
    closeOnCancel: true
  },
  function(isConfirm) {
    if (isConfirm){
      setTimeout(function(){

        var id_petiiciones_num_viaje = document.getElementById("id_petiiciones_num_viaje").value;
        var num_viaje = document.getElementById("num_viaje").value;
        var petiiciones_num_contrato = document.getElementById("petiiciones_num_contrato").value;
        
        var data = {
          "id_petiiciones_num_viaje":id_petiiciones_num_viaje,
          "num_viaje":num_viaje,
          "petiiciones_num_contrato":petiiciones_num_contrato,
        };
       // console.log(data)
        $.ajax({
          type: 'POST',
          url: 'querys/crear/query_num_viaje.php',
          data: data,
          success: function(respuesta) {
            //console.log(respuesta)
            $("#respuesta_num_viaje").html(respuesta);
          }
        });
      }, 2000);
    }
  });
}

function filtrar_tabla(valor_selecionado){
  var texto = document.getElementById("cedi_actual_en_la_tabla").value;
  $.ajax({
    type: 'POST',
    url: 'querys/consultar/consultar_solicitud_vehiculo_para_asignar.php',
    data: 'texto=' + texto,
    success: function(respuesta) {
      respuesta = JSON.parse(respuesta);
      if(valor_selecionado != ""){
        var Estado_seecionado = respuesta.cedi.filter(function(val) {
          return val.Estado === valor_selecionado;
        });
        $("#carga_tabla_asignacion_vehiculo").html(respuesta.cargar_tabla);
        //cedi_para_tabla = respuesta.cedi;
        cargar_tabla_por_cedi(Estado_seecionado);
      }else{
        $("#carga_tabla_asignacion_vehiculo").html(respuesta.cargar_tabla);
        cedi_para_tabla = respuesta.cedi;
        cargar_tabla_por_cedi(cedi_para_tabla);
      }
    }
  });
}
//ofoogfogo



/*COMPINENTE MODAL */
var ModalContent = React.createClass({
  getInitialState() {
    return {idsolicitudVehicular: ''}//
  },
  componentDidMount: function(){
    $('#modal_cargue').modal({
        show: true
      });
    $('.clockpicker1').clockpicker();
    $('#clockpicker1 .input-group.clockpicker1').clockpicker();
    $('#data_4 .input-group.date').datepicker();
    $('#data_3 .input-group.date').datepicker();
  },
  render: function() {
    return (
      <div  className="modal inmodal fade" id="modal_cargue" role="dialog" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <ModalHeader />
          <ModalBody idsolicitudVehicular={this.props.idsolicitudVehicular}/>
        </div>
      </div>
    </div>
    );
  }
});

var ModalHeader = React.createClass({
  render: function() {
    return (
        <div className="modal-header">
          <button type="button" className="close" data-dismiss="modal">
              <span aria-hidden="true">&times;</span>
              <span className="sr-only">Close</span>
          </button>
          <h4 className="modal-title">Datos adicionales</h4>
      </div>
    );
  }
});

var ModalBody = React.createClass({
  getInitialState() {
    //console.log(this.props.idsolicitudVehicular.idSolicitud_vehicular[0].Cedi)
    var hora_fin = this.props.idsolicitudVehicular.idSolicitud_vehicular[0].Hora_inicio;
    var hora_ini = this.props.idsolicitudVehicular.idSolicitud_vehicular[0].Hora_fin;
    var hora_fin_horas = hora_fin.split(":");
    var hora_fin_min = hora_fin.split(":");
    var hora_fin_horas = hora_fin_horas[0].trim();
    var hora_fin_min = hora_fin_min[1].trim();

    var hora_inicio_horas = hora_ini.split(":");
    var hora_inicio_min = hora_ini.split(":");
    var hora_inicio_horas = hora_inicio_horas[0].trim();
    var hora_inicio_min = hora_inicio_min[1].trim();

    var total_horas = (hora_fin_horas)-(hora_inicio_horas);
    var total_min = (hora_fin_min)-(hora_inicio_min);

    var total_horas=Math.abs(total_horas);
    var total_min=Math.abs(total_min);
  
    var destinatarioInfoCargaNodesSelect = this.props.idsolicitudVehicular.idDestinatarioInfoCarga.map(function(destinatario, i) {
      return (
        <option value={destinatario.Id_empresa}>
          {destinatario.Codigo_empresa +' - '+ destinatario.Razon_social}
        </option>
      );
    });

    var tiposDeOperacionNodesSelect = this.props.idsolicitudVehicular.idTiposDeOperacion.map(function(tipoDeoperacion, i) {
      return (
        <option value={tipoDeoperacion.Cod_tipo_operacion}>
          {tipoDeoperacion.Tipo_de_operacion}
        </option>
      );
    });

    var empaquesNodesSelect = this.props.idsolicitudVehicular.idEmpaques.map(function(empaque, i) {
      return (
        <option value={empaque.Codigo}>
          {empaque.Descripcion_completa}
        </option>
      );
    });
    var optionsStateCodNaturaleza = this.props.idsolicitudVehicular.idCodNaturalezaPVehicular[0].Cod_naturaleza;
    var naturalezaNodesSelect = this.props.idsolicitudVehicular.idNaturaleza.map(function(naturaleza, i) {
      var optionsState = "1";
      return (
        <option value={naturaleza.Tipo+'--_--'+ naturaleza.Cod_naturaleza} selected={optionsStateCodNaturaleza == naturaleza.Cod_naturaleza}>
          {naturaleza.Naturaleza_carga}
        </option>
      );
    });

    var clasificacionNodesSelect = this.props.idsolicitudVehicular.idClasificacionProductos.map(function(clasificacion, i) {
      var optionsClasificacion = "98";
      return (
        <option value={clasificacion.Codigo_clasificacion} selected={optionsClasificacion == clasificacion.Codigo_clasificacion}>
          {clasificacion.Clasificacion}
        </option>
      );
    });

    var codificacionProductoNodesSelect = this.props.idsolicitudVehicular.idCodificacionProducto.map(function(codificacion, i) {
      return (
        <option value={codificacion.Codigo}>
          {codificacion.Nombre}
        </option>
      );
    });

    var UnidadesDeMedidaNodesSelect = this.props.idsolicitudVehicular.idUnidadesDeMedida.map(function(unidad, i) {
      return (
        <option value={unidad.Sigla}>
          {unidad.Unidad_de_medida}
        </option>
      );
    });

    var afirmacionNodesSelect = this.props.idsolicitudVehicular.idAfirmacion.map(function(afirmacion, i) {
      var optionsAfirmacion = 1;
      return (
        <option value={afirmacion.Afirmacion} selected={optionsAfirmacion == afirmacion.Id_afirmacion}>
          {afirmacion.Afirmacion}
        </option>
      );
    });

    return {
            consecutivo_infocarga: this.props.idsolicitudVehicular.idSolicitud_vehicular[0].Id_asignacion,
            consecutivo_viaje: this.props.idsolicitudVehicular.idSolicitud_vehicular[0].Id_asignacion,
            id_peticiones_solicitud_vehicular: this.props.idsolicitudVehicular.idSolicitud_vehicular[0].Id_asignacion,
            destinatarioInfoCargaNodesSelect: destinatarioInfoCargaNodesSelect,
            inputauxiliar: false, string: '', 
            fecha_cita_cargue_remitente_infocarga: this.props.idsolicitudVehicular.idSolicitud_vehicular[0].Fecha_cita,
            horas_total_cargue_remitente_infocarga: total_horas,
            minutos_total_cargue_remitente_infocarga: total_min,
            selectValueDestinatario:'',
            tiposDeOperacionNodesSelect: tiposDeOperacionNodesSelect,
            tipo_operacion_infocarga_verificado: 'Carga General',
            cod_tipo_operacion_infocarga: 'G',
            empaquesNodesSelect: empaquesNodesSelect,
            empaque_infocarga_verificado: 'Varios',
            cod_empaque_infocarga: '17',
            naturalezaNodesSelect: naturalezaNodesSelect,
            naturaleza_infocarga_verificado: 'Carga Normal',
            cod_naturaleza_infocarga: '00--_--'+optionsStateCodNaturaleza,
            cod_naturaleza_infocarga1: optionsStateCodNaturaleza,
            descripcionProducto: '',
            clasificacionNodesSelected: clasificacionNodesSelect,
            codClasificacionProducto: '98',
            clasificacionProducto: 'Otros',
            codificacionProductoNodesSelect: codificacionProductoNodesSelect,
            codCodificacionProducto: '',
            codNomCodificacionProducto: '',
            UnidadesDeMedidaNodesSelect: UnidadesDeMedidaNodesSelect,
            codUnidadDemedida: '',
            UnidadDemedida: '',
            afirmacionNodesSelect: afirmacionNodesSelect,
            pactoTiemposRemitente: 'SI',
            hora_cita_cargue_remitente_infocarga: this.props.idsolicitudVehicular.idSolicitud_vehicular[0].Hora_fin,
            pactoTiemposDestinatario: 'SI',


          }
  },
  handleConsecutivoInfoCarga: function(event){
    this.setState({consecutivo_infocarga :event.target.value});
  },
  handleConsecutivoViaje: function(event){
    this.setState({consecutivo_viaje :event.target.value});
  },
  handleDestinatarioSelected: function(event){
    this.setState({selectValueDestinatario :event.target.value});
  },
  handleTipoDeOperacionSelected: function(event){
    var index =  event.nativeEvent.target.selectedIndex;
    this.setState({tipo_operacion_infocarga_verificado: event.nativeEvent.target[index].text});
    this.setState({cod_tipo_operacion_infocarga: event.target.value});
    if(event.target.value == "V"){
      this.setState({naturaleza_infocarga_verificado: 'Carga Normal'});
      this.setState({cod_naturaleza_infocarga: '00--_--1'});
      this.setState({cod_naturaleza_infocarga1: '1'});
      this.setState({descripcionProducto: 'CONTENEDOR VACIO'});
      var clasificacionNodesSelect = this.props.idsolicitudVehicular.idClasificacionProductos.map(function(clasificacion, i) {
        var optionsClasificacion = "99";
        return (
          <option value={clasificacion.Codigo_clasificacion} selected={optionsClasificacion == clasificacion.Codigo_clasificacion}>
            {clasificacion.Clasificacion}
          </option>
        );
      });
      var codificacionProductoNodesSelect = this.props.idsolicitudVehicular.idCodificacionProducto.map(function(codificacion, i) {
        var optionsCodificacion = "009990";
        return (
          <option value={codificacion.Codigo} selected={optionsCodificacion == codificacion.Codigo}>
            {codificacion.Nombre}
          </option>
        );
      });
      this.setState({clasificacionNodesSelected: clasificacionNodesSelect});
      this.setState({codificacionProductoNodesSelect: codificacionProductoNodesSelect});
      this.setState({codCodificacionProducto: '009990'});
      this.setState({codNomCodificacionProducto: 'Contenedor vacio'});
      this.setState({codClasificacionProducto: '99'});
      this.setState({clasificacionProducto: 'Varios'});
    }else if(event.target.value == "P"){
      this.setState({naturaleza_infocarga_verificado: 'Carga Normal'});
      this.setState({cod_naturaleza_infocarga: '00--_--1'});
      this.setState({cod_naturaleza_infocarga1: '1'});
      this.setState({descripcionProducto: 'PAQUETES VARIOS'});
      var clasificacionNodesSelect = this.props.idsolicitudVehicular.idClasificacionProductos.map(function(clasificacion, i) {
        var optionsClasificacion = "98";
        return (
          <option value={clasificacion.Codigo_clasificacion} selected={optionsClasificacion == clasificacion.Codigo_clasificacion}>
            {clasificacion.Clasificacion}
          </option>
        );
      });
      var codificacionProductoNodesSelect = this.props.idsolicitudVehicular.idCodificacionProducto.map(function(codificacion, i) {
        var optionsCodificacion = "009880";
        return (
          <option value={codificacion.Codigo} selected={optionsCodificacion == codificacion.Codigo}>
            {codificacion.Nombre}
          </option>
        );
      });
      this.setState({clasificacionNodesSelected: clasificacionNodesSelect});
      this.setState({codificacionProductoNodesSelect: codificacionProductoNodesSelect});
      this.setState({codCodificacionProducto: '009880'});
      this.setState({codNomCodificacionProducto: 'Miscelaneos contenidos en paquetes ( paqueteo )'});
      this.setState({codClasificacionProducto: '98'});
      this.setState({clasificacionProducto: 'Otros'});
    }else{
      this.setState({naturaleza_infocarga_verificado: 'Carga Normal'});
      this.setState({cod_naturaleza_infocarga: '00--_--1'});
      this.setState({cod_naturaleza_infocarga1: '1'});
      this.setState({descripcionProducto: ''});
      var clasificacionNodesSelect = this.props.idsolicitudVehicular.idClasificacionProductos.map(function(clasificacion, i) {
        return (
          <option value={clasificacion.Codigo_clasificacion}>
            {clasificacion.Clasificacion}
          </option>
        );
      });
      var codificacionProductoNodesSelect = this.props.idsolicitudVehicular.idCodificacionProducto.map(function(codificacion, i) {
        return (
          <option value={codificacion.Codigo}>
            {codificacion.Nombre}
          </option>
          );
      });
      this.setState({codificacionProductoNodesSelect: codificacionProductoNodesSelect});
      this.setState({codCodificacionProducto: ''});
      this.setState({codNomCodificacionProducto: ''});
      this.setState({clasificacionNodesSelected: clasificacionNodesSelect});
      this.setState({codClasificacionProducto: ''});
      this.setState({clasificacionProducto: ''});
    }
  },
  handleEmpaqueSelected: function(event){
    var indexEmpaque =  event.nativeEvent.target.selectedIndex;
    this.setState({empaque_infocarga_verificado: event.nativeEvent.target[indexEmpaque].text});
    this.setState({cod_empaque_infocarga: event.target.value});
  },
  handleNaturalezaSelected: function(event){
    var indexNaturaleza =  event.nativeEvent.target.selectedIndex;
    this.setState({naturaleza_infocarga_verificado: event.nativeEvent.target[indexNaturaleza].text});
    this.setState({cod_naturaleza_infocarga: event.target.value});
    var valueNaturaleza = event.target.value.split("--_--");
    this.setState({cod_naturaleza_infocarga1: valueNaturaleza[1]});
    var parametros_datos_clasificacion_infocarga = {
      "clasificacion": valueNaturaleza[0],
    }
    var self = this;
    $.ajax({    
      data: parametros_datos_clasificacion_infocarga,
      type: 'POST',
      url: 'querys/consultar/consultar_clasificacion_infocarga2.php',
      success:function (response) {
        var obj = JSON.parse(response);
        var clasificacionNodesSelect = obj.idClasificacionProductos.map(function(clasificacion, i) {
          return (
            <option value={clasificacion.Codigo_clasificacion} key={i}>
              {clasificacion.Clasificacion}
            </option>
          );
        });
        self.setState({clasificacionNodesSelected: clasificacionNodesSelect});
      }
    });
  },
  handleDescriptionProducto: function(event){
    this.setState({descripcionProducto: event.target.value});
  },
  handleClasificacionProducto: function(event){
    var indexClasificacionProducto =  event.nativeEvent.target.selectedIndex;
    this.setState({clasificacionProducto: event.nativeEvent.target[indexClasificacionProducto].text});
    this.setState({codClasificacionProducto: event.target.value});
  },
  handleCodificacionProducto: function(event){
    var indexCodificacionProducto =  event.nativeEvent.target.selectedIndex;
    this.setState({codNomCodificacionProducto: event.nativeEvent.target[indexCodificacionProducto].text});
    this.setState({codCodificacionProducto: event.target.value});
  },
  handleUnidadDeMedida: function(event){
    var indexUnidadDeMedida =  event.nativeEvent.target.selectedIndex;
    this.setState({UnidadDemedida: event.nativeEvent.target[indexUnidadDeMedida].text});
    this.setState({codUnidadDemedida: event.target.value});
    
  },
  handlePactoTiemposRemitente: function(event){
    this.setState({pactoTiemposRemitente: event.target.value});
  },
  handlePactoTiemposDestinatario: function(){
    this.setState({pactoTiemposDestinatario: event.target.value});
  },
  handleChange: function(event) {
    if(event.target.checked == true ){
      this.setState({inputauxiliar: true})
    }else{
      this.setState({inputauxiliar: false})
      this.setState({axiliarvalue: ''})
    }
  },
  auxiliar_selecionado_persona1: function(Id_persona ,e){
    console.log(Id_persona)
  },
  handleChangeinput: function(event) {
    var valores = "";
    this.setState({axiliarvalue: event.target.value})
      var parametros_infocarga_destinatario = {
        "nombre_auxiliar": event.target.value,
      }
      $.ajax({
        type: 'POST',
        url: 'querys/consultar/consultar_auxiliar_infocarga2.php',
        data: parametros_infocarga_destinatario,
        cache: false,
        success: function(respuesta) {
          respuesta = JSON.parse(respuesta)
          var self = this;
          var commentNodes = respuesta.map(function(comment, i) {
            var auxiliarClicked = {
              auxiliar_selecionado_persona3: function(No_documentoPersona, Nombre_completo){
                self.setState({axiliarvalue: No_documentoPersona + ' - ' + Nombre_completo});
                self.setState({numeroDocumentoAuxiliar: No_documentoPersona});

              }
            }
            var auxiliarClicked2 = auxiliarClicked.auxiliar_selecionado_persona3.bind(this, comment.No_documento , comment.Nombre_completo)
            return (
              <li key={comment.Id_persona} axiliar_documento={comment.No_documento}>
                <a onClick={auxiliarClicked2} key={i}>{comment.No_documento +' - '+ comment.Nombre_completo}</a>
              </li>
            );
          });
          this.setState({string: commentNodes});
        }.bind(this)
      });
  },
  handleProcesarDatosModal: function(event) {
    //console.log("tipo_operacion_peticiones_solicitud_vehicular : ((Pediente))");
    var self = this;
    var color = '#'+'0123456789abcdef'.split('').map(function(v,i,a){
      return i>5 ? null : a[Math.floor(Math.random()*16)] }).join('');
    swal({
      title: "¿Esta seguro guarda los datos?",
      text: "Guardar informacion viaje",
      type: "info",
      showCancelButton: true,
      confirmButtonColor: color,
      confirmButtonText: 'Si',
      cancelButtonText: "No",
      showLoaderOnConfirm: true,
      closeOnConfirm: false,
      closeOnCancel: true
    },
    function(isConfirm) {
      if (isConfirm){
        setTimeout(function(){
          var data ={  
            "idPeticionVehicular": self.state.id_peticiones_solicitud_vehicular,
            "consecutivo_infocarga": self.state.consecutivo_infocarga,
            "consecutivo_viaje": self.state.consecutivo_viaje,
            "DestinarioInforCargaId":self.state.selectValueDestinatario,
            "NumeroDocumentoAuxiliar":self.state.numeroDocumentoAuxiliar,
            "tipo_operacion_infocarga_verificado": self.state.tipo_operacion_infocarga_verificado,
            "cod_tipo_operacion_infocarga": self.state.cod_tipo_operacion_infocarga,
            "empaque_infocarga_verificado":self.state.empaque_infocarga_verificado,
            "cod_empaque_infocarga": self.state.cod_empaque_infocarga,
            "naturaleza_infocarga_verificado": self.state.naturaleza_infocarga_verificado,
            "cod_naturaleza_infocarga": self.state.cod_naturaleza_infocarga,
            "cod_naturaleza_infocarga1": self.state.cod_naturaleza_infocarga1,
            "descripcionProducto": self.state.descripcionProducto,
            "clasificacionProducto": self.state.clasificacionProducto,
            "codClasificacionProducto": self.state.codClasificacionProducto,
            "codNomCodificacionProducto": self.state.codNomCodificacionProducto,
            "codCodificacionProducto": self.state.codCodificacionProducto,
            "cantidadProducto": document.getElementById('cantidad_infocarga').value,
            "codUnidadDemedida":self.state.codUnidadDemedida,
            "unidadDemedida": self.state.UnidadDemedida, 
            "peso_contendor_vacio": document.getElementById('peso_contendor_vacio').value,
            "pactoTiemposRemitente":self.state.pactoTiemposRemitente,
            "fechaCitaRemitente": self.state.fecha_cita_cargue_remitente_infocarga,
            "horaCitaRemitente": self.state.hora_cita_cargue_remitente_infocarga,
            "fechaCargueRemitente": self.state.fecha_cita_cargue_remitente_infocarga,
            "horaCargueRemitente": document.getElementById('hora_cargue_remitente_infocarga').value,
            "fechaSalidaCargueRemitente": document.getElementById('fecha_cargue_salida_remitente_infocarga').value, 
            "HoraSalidaCargue": document.getElementById('hora_cargue_salida_remitente_infocarga').value, 
            "HorasTotalCargue": self.state.horas_total_cargue_remitente_infocarga,
            "MinutosTotalCargue": self.state.minutos_total_cargue_remitente_infocarga,
            "pactoTiemposDestinatario": self.state.pactoTiemposDestinatario,
            "FechaDestinoCita": document.getElementById('fecha_cita_destino_infocarga').value,
            "HoraDestinoCita": document.getElementById('hora_cita_destino_infocarga').value, 
            "FechaDescargueDestino": document.getElementById('fecha_descargue_destino_infocarga').value,
            "HorasTotalDescargue": document.getElementById('horas_total_descargue_destino').value,
            "MinutosTotalDescargue": document.getElementById('minutos_total_descargue_destino').value,
            "observaciones_infocarga": document.getElementById('observaciones_infocarga').value,
          }
          var json =JSON.stringify();
          json = {"ModalContentData": data}
          console.log(json) 
          $.ajax({
            url: 'querys/crear/query_infocarga_viaje_solicitud_vehiculo2.php',
            dataType: 'json',
            type: 'POST',
            data: json,
            success: function(data) {
              console.log(data);
              swal("Completado!", "Datos guardados con exito.", "success"); 
            }.bind(this),
            error: function(xhr, status, err) {
              //console.error(this.props.url, status, err.toString());
              //swal("Error", "Datos guardados con exito.", "error");
              swal("Completado!", "Datos guardados con exito.", "success"); 
            }.bind(this)
          });
        }, 2000);  
      }else{
        swal("Cancelado", "No se procedera a guardar los datos", "error");
      }
    });
  },
  render: function() {
    return (
        <div className="modal-body">
          <div className="row">
              <form className="m-t"  id="form_modal_asignacion" name="formulario_modal_asignacion"  method="post" role="form" action="#">
              {/*<!-- BUSQUEDA CLIENTE O DOCUMENTO REMITENTE-->*/}
                <input id="id_peticiones_solicitud_vehicular" type="hidden" value={this.state.id_peticiones_solicitud_vehicular}></input>
                <input id="tipo_operacion_peticiones_solicitud_vehicular" type="hidden"></input>
                <hr />
                  <center><label>Consecutivos (*)</label></center>
                <hr />
                {/*<!-- CONSECUTIVO INFORMACION DE LA CARGA --> */}
                <div className="col-lg-6">
                  <div className="form-group">
                    <label>Consecutivo Carga(*)</label>
                    <input type="text" id="consecutivo_infocarga"   value={this.state.consecutivo_infocarga } onChange={this.handleConsecutivoInfoCarga} className="form-control" />
                  </div>
                </div>
                {/*<!-- CONSECUTIVO INFORMACION DEL VIAJE --> */}
                <div className="col-lg-6">
                  <div className="form-group">
                    <label>Consecutivo Viaje (*)</label>
                    <input type="text" id="consecutivo_viaje"   value={this.state.consecutivo_viaje } onChange={this.handleConsecutivoViaje} className="form-control" />
                  </div>
                </div>
                <hr />
                  <center><label>DESTINATARIO Y AUXILIAR (*)</label></center>
                <hr />
                {/*<!-- DESTINATARIO --> */}
                {/*<div className="form-group">
                  <label>Destinatario (*)</label><br />
                  <select className="form-control m-b campo_select_destinatario"  name="id_db_destinatario_selecionado" id="id_db_destinatario_selecionado" onChange={this.handleDestinatarioSelected} value={this.state.selectValueDestinatario} required>
                    <option value="">Selecione</option>
                    {this.state.destinatarioInfoCargaNodesSelect}
                  </select>
                </div>*/}
                {/*<!-- AUXILIAR -->*/}
                <div className="form-group">
                  <div className="col-md-1">
                    <label>Auxiliar</label><br />
                    <div className="i-checks,m text-left ">
                      <input name="activo_auxiliar_check" id="activo_auxiliar_check" type="checkbox" value="0" onChange={this.handleChange}/>
                    </div>
                  </div>  
                  <div className="col-md-11">
                    <br />
                    <input id="a" type="hidden"></input>
                    <input type="hidden" value={this.state.numeroDocumentoAuxiliar} />
                    <input name="nombre_auxiliar" id="nombre_auxiliar" type="text" onChange={this.handleChangeinput} disabled={!this.state.inputauxiliar} value={this.state.axiliarvalue} placeholder="Digite No de documento" className="form-control dropdown-toggle" data-toggle="dropdown" />
                    <ul className="dropdown-menu scrollable-menu" role="menu" id="agregar_destinatario">
                      {this.state.string}
                    </ul>
                    
                  </div>  
                </div>
                <br /><br /><br /><br />
                {/*<!-- TIPO OPERACION-->*/}
                <hr />
                  <center><label>TIPO DE CARGA DE LA INFORMACION DE CARGA (*)</label></center>
                <hr />
                <div className="col-lg-6">
                  <div className="form-group">
                    <label>Tipo Operación (*)</label>
                    <input type="hidden" id="tipo_operacion_infocarga_verificado"   value={this.state.tipo_operacion_infocarga_verificado }/>
                    <input type="hidden" id="cod_tipo_operacion_infocarga" value={this.state.cod_tipo_operacion_infocarga }/>
                    <select className="form-control" data-placeholder="Selecione tipo de operacion" id="tipo_operacion_infocarga" name="tipo_operacion_infocarga" onChange={this.handleTipoDeOperacionSelected} value={this.state.cod_tipo_operacion_infocarga} required>
                      <option value="">--Selecione--</option>
                      {this.state.tiposDeOperacionNodesSelect}
                    </select>
                  </div>
                </div>
                {/*<!-- EMPAQUE --> */}
                <div className="col-lg-6">
                  <div className="form-group">
                    <label>Empaque (*)</label>
                    <input type="hidden" id="empaque_infocarga_verificado"  value={this.state.empaque_infocarga_verificado }/>
                    <input type="hidden" id="cod_empaque_infocarga" value={this.state.cod_empaque_infocarga }/>
                    <select className="select2_demo_1 form-control" data-live-search="true" id="empaque_infocarga" name="empaque_infocarga" onChange={this.handleEmpaqueSelected} value={this.state.cod_empaque_infocarga} required>
                      <option value="">--Selecione--</option>
                      {this.state.empaquesNodesSelect}
                    </select>
                  </div>
                </div>
                <br />
                <hr />
                  <center><label>PRODUCTO (*)</label></center>
                <hr />
                {/*<!-- NATURALEZA --> */}
                <div className="form-group">
                  <label>Naturaleza (*)</label>
                  <input type="hidden" id="naturaleza_infocarga_verificado"  value={this.state.naturaleza_infocarga_verificado }/>
                  <input type="hidden" id="cod_naturaleza_infocarga1"  value={this.state.cod_naturaleza_infocarga1 }/>
                  <input type="hidden" id="cod_naturaleza_infocarga"  value={this.state.cod_naturaleza_infocarga }/>
                  <select className="form-control m-b" onchange="naturaleza_producto(this.value)" name="naturaleza_infocarga" id="naturaleza_infocarga" onChange={this.handleNaturalezaSelected} value={this.state.cod_naturaleza_infocarga} required={true}>
                    <option value="">--Selecione--</option>
                    {this.state.naturalezaNodesSelect}
                  </select>
                </div>
                {/*<!-- DESCRIPCION CORTA --> */}
                <div className="form-group">
                  <label>Descripción corta del producto(*)</label>
                  <input name="descripcion_infocarga" id="descripcion_infocarga" type="text" placeholder="Digite descripcion del producto" className="form-control" required onChange={this.handleDescriptionProducto} value={this.state.descripcionProducto} />
                </div>
                {/*<!-- colg-lg-6 for another componente -->*/}
                <div className="col-lg-6">
                  <div className="form-group">
                    {/*<!-- CLASIFICACION -->*/}
                    <label>Clasificacion (*)</label>
                    <select className="select2_demo_1 form-control" data-live-search="true"  name="clasificacion_infocarga" id="clasificacion_infocarga" onChange={this.handleClasificacionProducto} value={this.state.codClasificacionProducto} required>
                      <option value="">--Selecione la naturaleza primero--</option>
                      {this.state.clasificacionNodesSelected}
                    </select>
                  </div>
                  {/*<!-- CODIFICACION --> */}
                  <div className="form-group">
                    <label>Codificacion (*)</label>
                    <select className="select2_demo_2 form-control" data-live-search="true"  name="codificacion_infocarga" id="codificacion_infocarga" onChange={this.handleCodificacionProducto} value={this.state.codCodificacionProducto} required>
                      <option value="">Selecione la clasificacion primero</option>
                      {this.state.codificacionProductoNodesSelect}
                    </select>
                  </div>
                  {/*<!-- CODIGO PRODUCTO -->*/}
                  <div className="form-group">
                    <label>Codigo del Producto (*)</label>
                    <input name="codigo_infocarga" id="codigo_infocarga" type="text" placeholder="Digite el Codigo del Producto" className="form-control" value={this.state.codCodificacionProducto} disabled />
                  </div>
                </div>
                {/*<!-- end colg-lg-6 for another componente -->*/}
                {/*<!-- CANTIDAD DEL PRODUCTO -->*/}
                <div className="col-lg-6">
                  <div className="form-group">             
                    <label>Cantidad Carga(*)</label>
                    <input name="cantidad_infocarga" id="cantidad_infocarga" type="text" placeholder="Digite la Cantidad del Producto" className="form-control" required={true}/>
                  </div>
                </div>
                {/*<!-- MEDICION CARGA -->*/}
                <div className="col-lg-6">
                  <label>Medida</label>
                  <input type="hidden" id="medida_infocarga_verificar" value={this.state.UnidadDemedida} />
                  <input type="hidden" id="cod_medida_infocarga" value={this.state.codUnidadDemedida} />
                  <select className="form-control m-b" name="medida_infocarga" id="medida_infocarga" onChange={this.handleUnidadDeMedida} value={this.state.codUnidadDemedida} required>
                    <option value="">--Selecione--</option>
                    {this.state.UnidadesDeMedidaNodesSelect}
                  </select>
                </div>
                {/*<!-- Peso Contenedor Vacio -->*/}
                <div className="col-lg-6">
                  <div className="form-group">             
                    <label>Peso contenedor vacio(*)</label>
                    <input name="peso_contendor_vacio" id="peso_contendor_vacio" type="text" placeholder="Digite peso contenedor vacio" className="form-control" />
                  </div>
                </div>
                {/*<!-- end colg-lg-6 for another componente2 -->*/}
                <div className="col-lg-6">
                  {/*<!-- PACTO TIEMPOS -->*/}
                  <div>
                    <div className="form-group">
                      <label>Origen</label>
                    </div>
                    <label>Pacto Tiempos</label>
                    <select className="form-control m-b" id="pacto_tiempos_remitente_infocarga" name="pacto_tiempos_remitente_infocarga" onChange={this.handlePactoTiemposRemitente} value={this.state.pactoTiemposRemitente} disabled>
                      <option value="">--Selecione--</option>
                      {this.state.afirmacionNodesSelect}
                    </select>
                  </div>
                  {/*<!-- FECHA VIAJE -->*/}
                  <div className="form-group">
                    <label>Fecha Cita</label>
                    <input type="text" className="form-control" id="fecha_cita_cargue_remitente_infocarga" name="fecha_cita_cargue_remitente_infocarga" placeholder="Fecha cita" value={this.state.fecha_cita_cargue_remitente_infocarga} />
                  </div>
                  {/*<!-- HORA CITA -->*/}
                  <div className="form-group">
                    <label>Hora Cita</label>
                    <input type="text" name="hora_cita_cargue_remitente_infocarga" id="hora_cita_cargue_remitente_infocarga" className="form-control" value={this.state.hora_cita_cargue_remitente_infocarga} />
                  </div>
                  {/*<!-- FECHA CARGUE -->*/}
                  <div className="form-group">
                    <label>Fecha Cargue</label>
                    <input type="text" className="form-control" id="fecha_cargue_remitente_infocarga" name="fecha_cargue_remitente_infocarga" placeholder="Fecha cargue" value={this.state.fecha_cita_cargue_remitente_infocarga} disabled />
                  </div>
                  {/*<!-- HORA CITA -->*/}
                  <div className="form-group">
                    <label>Hora Cargue (*)</label>
                    <div className="input-group clockpicker1" id="clockpicker1" data-autoclose="true">
                      <input type="text" name="hora_cargue_remitente_infocarga" id="hora_cargue_remitente_infocarga" className="form-control" />
                      <span className="input-group-addon">
                        <span className="fa fa-clock-o" ></span>
                      </span>
                    </div>
                  </div>
                  {/*<!-- FECHA SALIDA CARGUE -->*/}
                  <div className="form-group">
                    <label>Fecha salida cargue</label>
                    <div className="form-group data_4" id="data_3" data-autoclose="true">
                      <div className="input-group date">
                        <span className="input-group-addon">
                          <i className="fa fa-calendar"></i>
                        </span>
                        <input type="text" className="form-control" id="fecha_cargue_salida_remitente_infocarga" name="fecha_cargue_salida_remitente_infocarga" placeholder="Fecha Llegada Destino"  required />
                      </div>
                    </div>
                  </div>
                  {/*<!-- HORA CITA -->*/}
                  <div className="form-group">
                   <label>Hora salida cargue</label>
                    <div className="input-group clockpicker1" id="clockpicker1" data-autoclose="true">
                      <input type="text" name="hora_cargue_salida_remitente_infocarga" id="hora_cargue_salida_remitente_infocarga" className="form-control" />
                      <span className="input-group-addon">
                        <span className="fa fa-clock-o" ></span>
                      </span>
                    </div>
                  </div>
                  {/*<!-- HORA CARGUE -->*/}
                  <label>Tiempo Total de Cargue(*)</label>
                  <div>
                    <div className="form-group">
                      <label>Hora cargue (*)</label>
                      <input name="horas_total_cargue_remitente_infocarga" id="horas_total_cargue_remitente_infocarga" type="text" className="form-control" value={this.state.horas_total_cargue_remitente_infocarga} />
                    </div>
                    {/*<!-- MINUTO CARGUE -->*/}
                    <div className="form-group">
                      <label>Minuto cargue (*)</label>
                      <input name="minutos_total_cargue_remitente_infocarga" id="minutos_total_cargue_remitente_infocarga" type="text" className="form-control" value={this.state.minutos_total_cargue_remitente_infocarga} />
                    </div>
                  </div>
                </div>
                {/*<!-- end colg-lg-6 for another componente2 -->*/}
                {/*<!-- end colg-lg-6 for another componente3 -->*/}
                <div className="col-lg-6">
                  {/*<!-- PACTOS TIEMPOS  -->*/}
                  <div>
                    <div className="form-group">
                      <label>Destino</label>
                    </div>
                    <label>Pacto Tiempos</label>
                    <select className="form-control m-b" id="pacto_tiempos_destinatario_infocarga" name="pacto_tiempos_destinatario_infocarga" onChange={this.handlePactoTiemposDestinatario} value={this.state.pactoTiemposDestinatario}>
                      <option value="">--Selecione--</option>
                      {this.state.afirmacionNodesSelect}
                    </select>
                  </div>
                  {/*<!-- FECHA LLEGADA DESTINO  -->*/}
                  <div className="form-group">
                    <label>Fecha Llegada Destino (*)</label>
                    <div className="form-group data_4" id="data_3" data-autoclose="true">
                      <div className="input-group date">
                        <span className="input-group-addon">
                          <i className="fa fa-calendar"></i>
                        </span>
                        <input type="text" className="form-control" id="fecha_cita_destino_infocarga" name="fecha_cita_destino_infocarga" placeholder="Fecha Llegada Destino"  required />
                      </div>
                    </div>
                  </div>
                  {/*<!-- HORA CITA DESTINO  -->*/}
                  <div className="form-group">
                    <label>Hora Cita (*)</label>
                    <div className="input-group clockpicker1" id="clockpicker1" data-autoclose="true">
                      <input type="text" name="hora_cita_destino_infocarga" id="hora_cita_destino_infocarga" className="form-control" />
                      <span className="input-group-addon">
                        <span className="fa fa-clock-o" ></span>
                      </span>
                    </div>
                    {/*<!-- FECHA DESCARGUE -->*/}
                    <div className="form-group">
                      <label>Fecha Descargue (*)</label>
                      <div className="form-group data_4" id="data_4" data-autoclose="true">
                        <div className="input-group date">
                          <span className="input-group-addon">
                            <i className="fa fa-calendar"></i>
                          </span>
                          <input type="text" className="form-control" id="fecha_descargue_destino_infocarga" name="fecha_descargue_destino_infocarga" placeholder="Fecha Descargue" required />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*<!-- HORAS DESCARGUE -->*/}
                  <label>Tiempo Total de Descargue(*)</label>
                  <div>
                    <div className="form-group">
                      <label>Hora Descargue (*)</label>
                      <input name="horas_total_descargue_destino" id="horas_total_descargue_destino" type="text" className="form-control" required />
                    </div>
                    {/*<!-- MINUTOS DESCARGUE --> */}
                    <div className="form-group">
                      <label>Minutos Descargue (*)</label>
                      <input name="minutos_total_descargue_destino" id="minutos_total_descargue_destino" type="text" className="form-control" required />
                    </div>
                    {/*OBSERVACIONES */}
                    <div className="form-group">
                      <label>Observaciones (*)</label>
                      <textarea name="observaciones_infocarga" id="observaciones_infocarga" rows="5" className="form-control" required />
                    </div>
                  </div>
                </div>
                {/*<!-- end colg-lg-6 for another componente3 -->*/}
                </form>
          </div>
          <div class="modal-footer">
            <button type="button" onClick={this.handleProcesarDatosModal} className="btn btn-white" >Enviar</button>
          </div>
        </div>
    );
  }
});