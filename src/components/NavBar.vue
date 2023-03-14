<template>
    <nav class="navbar navbar-expand-sm navbar-light bg-light" style="height:7vh">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto d-flex justify-content-between" style="width:100%">
                <div class="d-flex ps-3">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/">Home</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/map">Map</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/riders">Add Riders</router-link>
                    </li>
                </div>
                <div class="pe-3">
                    <li class="nav-item dropdown dropleft">
                        <a class="nav-link dropdown-toggle dropleft" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Menu
                        </a>
                        <div class="dropdown-menu dropdown-menu-start" aria-labelledby="navbarDropdown"
                            style="right: 0; left: auto;">
                    <li class="nav-item active">
                        <router-link class="nav-link dropdown-item" to="/Login">Login</router-link>
                    </li>
                    <li class="nav-item active">
                        <router-link class="nav-link dropdown-item" to="/Signup">Signup</router-link>
                    </li>
                </div>
                </li>
        </div>
        </ul>
        </div>
    </nav>
</template>
  
<script>

export default {
    name: 'NavBar',
    components: {
    }
}
</script>
  
<style scoped></style>