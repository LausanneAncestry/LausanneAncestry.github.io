<script setup lang="ts">

</script>

<template>
  <main>
    <div class="analysis">
      <h1 class="analysis_title">Sources</h1>
      <div>
        La source principale de notre travail sont les recensements Lausannois, fournis par le Lausanne Time Machine
        lab, déjà scannés et transformés en fichiers csv. Ces derniers nous donnent l’ensemble des habitants hommes de
        la ville de Lausanne (ainsi qu' un nombre restreint de femmes, surtout des veuves) par année, et contient les
        données suivantes:
        <ul>
          <li class="retenu">Adresse (Rue et numéro)</li>
          <li>Nom du propriétaire</li>
          <li class="retenu">Nom du chef de famille</li>
          <li class="retenu">Prénom du chef de famille</li>
          <li class="retenu">Année de naissance du chef de famille</li>
          <li>Nom de l’épouse</li>
          <li>Année de naissance de l’épouse</li>
          <li class="retenu">Nom des enfants dans le domicile</li>
          <li class="retenu">Prénom des enfants dans le domicile</li>
          <li class="retenu">Année de naissance des enfants</li>
          <li class="retenu">Origine du chef de famille</li>
          <li class="retenu">Travail du chef de famille</li>
          <li>Nom des pensionnaires</li>
          <li>Prénom des pensionnaires</li>
          <li>Année de naissance des pensionnaires</li>
          <li>Origine des pensionnaires</li>
        </ul>
        Un nombre de ces catégories sont superflues pour notre analyse. En effet, étant donné que nous nous concentrons
        uniquement sur la relation entre parents et enfants, et que l’épouse n’a pas de champ décrivant son emploi, nous
        avons uniquement retenu les champs en gras.
        <br><br>
        Bien que nous avions à disposition un large nombre de recensements, nous avons décidé de n’en prendre qu’un
        nombre restreint, afin d’alléger le temps de computation et de faciliter l’analyse. Après avoir regardé la qualité des
        recensements et de leur recognition automatique, nous avons décidé d’utiliser les recensements suivants, qui
        semblaient avoir une représentativité satisfaisante à travers le temps et donc les générations:
        <ul>
          <li>1835</li>
          <li>1855</li>
          <li>1874</li>
          <li>1890</li>
        </ul>

      </div>
    </div>
  </main>
</template>

<style>
ul {
  margin-top: 5px;
  margin-bottom: 5px;
  column-count: 2;
  column-gap: 40px;
  list-style-type: disc;
  padding-left: 20px;
}

.retenu {
  font-weight: bold;
}
</style>