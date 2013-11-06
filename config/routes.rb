SharePla::Application.routes.draw do
  root 'top#index'

  get  '/plans/new',          to: 'plans#index'
  post '/plans/add',          to: 'plans#add'
  post '/plans/save',         to: 'plans#save'
  post '/plans/search/hotel', to: 'plans#search_hotel'
  get  '/plans/show/:id',     to: 'top#show',          as: :plan
  post '/plans/clone',        to: 'plans#clone',       as: :plans_clone

  get  '/pdf/sample',  to: 'documents#sample'
  get  '/static/',     to: 'top#static'
  get  '/pdf/:id.pdf', to: 'documents#string', as: 'pdf'
  post '/pdf/create',  to: 'documents#create'

  #get "hello/to/:name" => "hello#to"
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  #root 'newplan#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end
  
  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
