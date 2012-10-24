var conta = "685-066-9527"; /*ID da Conta */
var conta_nome = "Sonar"; /*Nome da Conta*/
var tipo_relatorio = 'diario';/*Tipo do relatório a ser executado (personalizado , diario)*/
var data_relatorio = '20121022';/* Data usada para relatório personalizado no formato AAAAMMDD */
var sheet = 'Dados Adwords';/*Nome da Planilha onde será armazenada as informações*/
function main() {

var Tabela = SpreadsheetApp.openById("0ApANcqZt8kI6dEFVUzI1Z1RYcGxvSzZGa2UxX3VNdFE");
var Planilha = Tabela.getSheetByName(sheet);
var search =  get_dados('search');
var display = get_dados('display'); 

Planilha.appendRow([
  get_data() ,
  conta_nome , 
  conta ,
  search.clicks ,
  display.clicks ,
  search.impressoes ,
  display.impressoes ,
  search.custo ,
  display.custo ,
  search.conversao ,
  display.conversao ,
  search.posicao_media
  ]);
}

function get_dados(rede){
  var Dados = [];
Dados={
clicks: 0,
impressoes: 0, 
custo: 0,
conversao: 0,
posicao_media: 0
};
  if(rede == 'display'){
    var condition = "CONTAINS_IGNORE_CASE";
  }
  else{
    var condition =  "DOES_NOT_CONTAIN_IGNORE_CASE";
  }
  if(tipo_relatorio == 'diario'){
    var campaignIterator = AdWordsApp.campaigns()
        .withCondition("Name "+condition+" 'display'")
        .forDateRange('YESTERDAY')
        .get();
    while (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      var stats = campaign.getStatsFor('YESTERDAY');
      Dados.impressoes += stats.getImpressions();
      Dados.clicks += stats.getClicks();
      Dados.custo += stats.getCost();
      Dados.conversao += stats.getConversions();
      Dados.posicao_media += stats.getAveragePosition()*stats.getImpressions();
    }
    Dados.posicao_media = Math.round(Dados.posicao_media/Dados.impressoes*100)/100;
  }
  else{
    var campaignIterator = AdWordsApp.campaigns()
        .withCondition("Name "+condition+" 'display'")
        .forDateRange(data_relatorio , data_relatorio)
        .get();
    while (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      var stats = campaign.getStatsFor(data_relatorio , data_relatorio);
      Dados.impressoes += stats.getImpressions();
      Dados.clicks += stats.getClicks();
      Dados.custo += stats.getCost();
      Dados.conversao += stats.getConversions();
      Dados.posicao_media += stats.getAveragePosition()*stats.getImpressions();
    }
    Dados.posicao_media = Math.round(Dados.posicao_media/Dados.impressoes*100)/100;
  }
      return Dados;
}

function get_data(){
  if(tipo_relatorio == 'diario'){
  var data = new Date(); 
    data.setDate(data.getDate() - 1);
    var ys = new String(data.getFullYear()); 
    var ms = new String(data.getMonth() + 1) ; 
    var ds = new String(data.getDate()) ;
    if ( ms.length == 1 ) ms = "0" + ms; 
    if ( ds.length == 1 ) ds = "0" + ds;
    data = ds+'/'+ms+'/'+ys;
  }
  else{
    var data=  data_relatorio; 
    data = data.substr(6,2)+'/'+data.substr(4,2)+'/'+data.substr(0,4);
  }
  return data;
}