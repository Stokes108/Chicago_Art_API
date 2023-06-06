let art_ids = ['28560','27992', '56682', '118260', '20684', '14572', '79349', '87088', '45259']


let art_info = {  }
let artist_info = { }

let headers = new Headers([
    ['Content-Type', 'application/json'],
    ['Accept', 'application/json'],
]);

let overall_data = async function(art_id){
   

    let new_data = await fetch(`https://api.artic.edu/api/v1/artworks/${art_id}?fields=id,title,artist_title,date_display,image_id,thumbnail,classification_title,style_title,place_of_origin`,{
        method : 'GET',
        headers: headers
    })

    let data_response = await new_data.json();

    return data_response

}

let artist_data = async function(name){
    let search = await fetch(`https://api.artic.edu/api/v1/artists/search?q=${name}/page=1&limit=1`,{
        method : 'GET',
        headers: headers
    })

    let response = await search.json(); 
    let artist_id = response['data'][0]['id']

    let artist_info = await fetch(`https://api.artic.edu/api/v1/agents/${artist_id}`,{
        method : 'GET',
        headers: headers
    })
    let artist_response = await artist_info.json(); 

    return artist_response
    
}


let create_img_URL = function (image_id, IIIF_URL){
    image_url = `${IIIF_URL}/${image_id}/full/843,/0/default.jpg`
    return image_url
}


let add_data_to_dictonary =  async (ids) =>{
    for (let i = 0; i < ids.length; i++){
        art_info[[ids[i]]] =  await overall_data(ids[i])
        let image_num = art_info[[ids[i]]]['data']['image_id']
        let IIIF = art_info[[ids[i]]]['config']['iiif_url']
        let artist_name = art_info[[ids[i]]]['data']['artist_title']

        

        art_info[[ids[i]]]['image_url'] =  create_img_URL(image_num, IIIF);

        artist_info[[ids[i]]] = await artist_data(artist_name)



        display_pictures_titles(art_info[[ids[i]]], artist_info[ids[i]])        
    }
    console.log(artist_info)
}

let display_pictures_titles = (art_stats, artist_stats) => {
    // console.log(art_stats)

    let image_url = art_stats['image_url'];
    let title = art_stats['data']['title'];
    let artist = art_stats['data']['artist_title'];
    let date = art_stats['data']['date_display'];
    let style = art_stats['data']['style_title'];
    let location = art_stats['data']['place_of_origin'];
    let material = art_stats['data']['classification_title']
    let alt_text = art_stats['data']['thumbnail']['alt_text']
    

    let birthDate = artist_stats['data']['birth_date']
    let deathDate = artist_stats['data']['death_date']
    let description = artist_stats['data']['description']
    let age = Number(deathDate) - Number(birthDate);


    // let ageAtPublish = Number(date) - Number(birthDate);

    if (!style){
        style = 'Trippy-Dippy Shit'
    }


    if(description){
        const parser = new DOMParser();
        const life = parser.parseFromString(description, 'text/html').body;
        first_para = life.getElementsByTagName('p')[0].innerHTML;
    }else{
        first_para ="There is no more information about this artist in the Chicago Institute of Art Public API"
    }


        html =`<div class = 'grid-item'>
                <a target="_blank" href="${image_url}"><img class="img" src="${image_url}" alt="${alt_text}"></a>                    

                <h3 class="img-title" onclick='art_modal_display("${title}", "${artist}","${date}","${style}","${material}","${image_url}", "${alt_text}", "${location}");'> ${title} </h3>
                <p class='artist-title' onclick='artist_modal_display("${artist}", "${birthDate}", "${deathDate}", "${first_para}", "${age}");'> Created by: ${artist} </p>
                </div>
            `
        document.getElementById('grid-container').insertAdjacentHTML('beforeend', html);
    }
// in pop_up display where artwork was found- and when artist lived? This artwork was found in (blank) and was completed with (artist) was x years old 


let art_modal_display = (title, artist, date, style, material, image_url, alt_text, location) => {
    console.log(title)

    let modal = document.getElementById("myModal");
    let modal_HTML = `<div class="modal-content">
                        <a target="_blank" href="${image_url}"><img class="modal-img" src="${image_url}" alt="${alt_text}"></a>
                            <div class="modal-info">
                                <h2 class="'modal-title">${title}</h2>
                                <p class=''>Artist: ${artist} <br> Date Displayed: ${date} <br> Style: ${style} <br> Material: ${material} <br> Place of Origin: ${location} </p>
                            </div>
                            <span class="close">&times;</span>
                        </div>`

    document.getElementById('myModal').innerHTML = modal_HTML;

    let span = document.getElementsByClassName("close")[0];

      
    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }

    modal.style.display = "block";
}



let artist_modal_display = (artist, birth, death, life_info, age) => {
    console.log(life_info)

    let modal = document.getElementById("myModal");
    let modal_HTML = `<div class="modal-content">
                            <div class="artist-modal-info">
                                <h2 class="'modal-title">${artist}</h2>
                                <br>
                                <p class=''>Born: ${birth} <br> Death: ${death} <br> Age at Death: ${age} years<br> <br> ${life_info} </p>
                            </div>
                            <span class="close">&times;</span>
                        </div>`
    console.log(life_info)

    document.getElementById('myModal').innerHTML = modal_HTML;

    let span = document.getElementsByClassName("close")[0];

      
    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }

    modal.style.display = "block";
}

add_data_to_dictonary(art_ids)



//create the popup
//style artist info 
//style page with good colors 
