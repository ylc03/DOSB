<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/CompletionActivity.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	Index
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="ScriptContent" runat="server">
<script language="javascript">
    $(document).ready(function () {
        $('#example').dataTable({
		    "bJQueryUI": true,
		    "sPaginationType": "full_numbers",
	        "bProcessing": true,
		    "bServerSide": true,
		    "sAjaxSource": "/CompletionActivity/_SelectAjax"
	    } );
} );

</script>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

<table cellspacing="0" cellpadding="0" border="0" id="example" class="display">
	<thead>
		<tr>
            <th rowspan="2" >Clinet</th>
			<th rowspan="2" >Country</th>
			<th rowspan="2" >Rigs</th>
			<th rowspan="2" >Wells</th>
			<th rowspan="2" >Fields</th>
            <th rowspan="2" >Well Type</th>
            <th rowspan="2" >Completion Type</th>
            <th rowspan="2" >Status</th>
            <th colspan="6" class="ui-state-default">Upper Completions</th>        
            <th colspan="10" class="ui-state-default" >Lower Completions</th>
            <th rowspan="2" >Comments</th>         
            <th rowspan="2" >DESC Engineer</th>
        </tr>
        <tr>
			<th class="bl">TRSV</th>
			<th>WRSV</th>
            <th>Packers</th>
            <th>PDHMS</th>
            <th>SSD</th>
            <th class="br">MFIV</th>
            
            <th class="bl">LH</th>
			<th>Packers</th>
            <th>ICD</th>
            <th>PDHMS</th>
            <th>SSD</th>
            <th>MFIV</th>
            <th>Flow Control</th>
            <th>Screens</th>
            <th>DTS</th>
            <th class="br">LBFIV</th>
            
	    </tr>
	</thead>
	
    <tbody>
        <tr class="gradeA">
			<td class="center">SA</td>
			<td class="center">Saudi</td>
			<td class="center">ENSCO-95</td>
			<td class="center">SFNY-601</td>
			<td class="center">SFNY</td>
            <td class="center">Oil</td>
            <td class="center">OH ICD</td>
            <td class="center">Develop</td>
            <td class="center" style=" background-color:#0099FF">BHI</td>
            <td class="center"></td>
            <td class="center" style=" background-color:#0099FF">BHI</td>
            <td class="center" style=" background-color:#0099FF">BHI</td>
            <td></td>
            <td></td>
            <td class="center" style=" background-color:#0099FF">BHI</td>
            <td class="center" style=" background-color:Red">HLS</td>
            <td class="center" style=" background-color:#0099FF">BHI</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="center" style=" background-color:#0099FF">BHI</td>
            <td>BHI TTR for 350 um ICD</td>
            <td>AAA</td>
		</tr>
		
        <tr class="gradeA">
			<td></td>
			<td></td>
			<td></td>
			<td></td>
			<td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="center">4.5TE-5</td>
            <td></td>
            <td class="center">Premier</td>
            <td class="center">PDHMS</td>
            <td></td>
            <td></td>
            <td class="center">SLZXP</td>
            <td class="center">Constrivtor</td>
            <td class="center">5 EQUALIZER</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="center">BFLCV</td>
		</tr>
    </tbody> 
</table>
</asp:Content>