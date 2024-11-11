# GET : https://googlereviewsolicitor.azurewebsites.net/api/Roles?identifier=abdelmounim_sifelhak
get all roles

# POST : https://googlereviewsolicitor.azurewebsites.net/api/AddRole?identifier=abdelmounim_sifelhak
post one role.
Payload
{
name: string;
roleIcon: number;
permissions: Permission[]
}