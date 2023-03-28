<template>
    <h1>Add Horse Info</h1>
    <div class="buh">
        <div class="card" style=" background-color: lightgray; border-style: solid; border-color: black; border-width: 1px; width: 400px">
            <div class="card-body">
                <h2 class="text-start">Horse Name: 
                    <input id="horseName" placeholder="Aa">
                </h2> 
                <h3 class="text-start">Provider: 
                    <input id="horseProvider" placeholder="Aa">
                </h3>
                <h3 class="text-start">Spurs: 
                    <input id="horseSpurs" placeholder="Aa">
                </h3>
                <h3 class="text-start">Reign: 
                    <input id="horseReign" placeholder="Aa">
                </h3>
                <h3 class="text-start">Minimum Weight: 
                    <input id="horseMinWeight" placeholder="Aa">
                </h3>
                <h3>Description</h3>
                <textarea id="data" style="width: 350px; height: 170px" rows="10" cols="80"></textarea>
                <button type="button" class="btn btn-primary">Submit</button>
                
            </div>
        </div>
    </div>
</template>


<script>
    export default {
        name: 'HorseAddEdit'
    }
</script>


<style>
h2 {
    font-size: 200% !important;
}
h3 {
    font-size: 150% !important;
}
.buh{
    display: flex;
    align-items: center;
    justify-content: center;
}
.nnl{
    display: inline;
}
.largeTextBox{
    width: 350px;
}
</style>