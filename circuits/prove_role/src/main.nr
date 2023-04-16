use dep::std;

fn main(
    role_hashes: pub [Field;5],
    role: pub u4,
    salt: u32,
) {
    // first, prove that you are one of the players
    let role_hash = std::hash::pedersen([role as Field, salt as Field]);
    //let mut is_playing = 0;
    let mut counter = 0;

    if role_hashes[0] == role_hash[0] { 
        counter = counter + 1;
    }
    if role_hashes[1] == role_hash[0] { 
        counter = counter + 1;
    }
    if role_hashes[2] == role_hash[0] { 
        counter = counter + 1;
    }
    if role_hashes[3] == role_hash[0] { 
        counter = counter + 1;
    }
    if role_hashes[4] == role_hash[0] { 
        counter = counter + 1;
    }

    // constrain role_hashes[1] == role_hash[0];
    // constrain role_hashes[2] == role_hash[0];
    // constrain role_hashes[3] == role_hash[0];
    // constrain role_hashes[4] == role_hash[0];
    constrain counter == 1;


    // constrain role_hashes[0] == role_hash[0];
    // constrain role_hashes[1] == role_hash[0];
    // constrain role_hashes[2] == role_hash[0];
    // constrain role_hashes[3] == role_hash[0];
    // constrain role_hashes[4] == role_hash[0];
   // constrain role_hash[0] == 1;
    //constrain (role_hash[0] == role_hashes[0]) | (role_hash[0] == role_hashes[1]) | (role_hash[0] == role_hashes[2]) | (role_hash[0] == role_hashes[3]) | (role_hash[0] == role_hashes[4]);

    // for i in 0..5 {
    //     if(role_hash == role_hashes[i]) {
    //         is_playing = ;
    //     }
    // }
    //constrain is_playing == 1;
}